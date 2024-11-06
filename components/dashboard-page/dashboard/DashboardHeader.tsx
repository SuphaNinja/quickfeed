import React from 'react'

interface Feedback {
    rating: number;
    createdAt: Date
}

interface Task {
    createdAt: Date;
    status: string;
}

interface ProjectRoom {
    data: {
        title: string;
        feedbacks: Feedback[];
        tasks: Task[];
    };
}

interface DashboardHeaderProps {
    projectRoom: ProjectRoom;
}

const calculateTaskStats = (tasks: Task[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const activeTasks = tasks.filter(task => task.status === "active").length;
    const tasksAddedToday = tasks.filter(task => {
        const taskDate = new Date(task.createdAt);
        return taskDate >= today;
    }).length;

    return {
        activeTasks,
        tasksAddedToday
    };
}

const calculateFeedbackGrowth = (feedbacks: Feedback[]) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const currentMonthFeedbacks = feedbacks.filter(feedback => {
        const feedbackDate = new Date(feedback.createdAt);
        return feedbackDate.getMonth() === currentMonth && feedbackDate.getFullYear() === currentYear;
    });

    const lastMonthFeedbacks = feedbacks.filter(feedback => {
        const feedbackDate = new Date(feedback.createdAt);
        return feedbackDate.getMonth() === lastMonth && feedbackDate.getFullYear() === lastMonthYear;
    });

    const growth = currentMonthFeedbacks.length - lastMonthFeedbacks.length;
    const growthPercentage = lastMonthFeedbacks.length > 0
        ? ((growth / lastMonthFeedbacks.length) * 100).toFixed(0)
        : 'N/A';

    return {
        growth,
        growthPercentage
    }
}

const calculateRatingStats = (feedbacks: Feedback[]) => {
    if (feedbacks.length === 0) {
        return { averageRating: 0, goodPercentage: 0 };
    }

    const totalRating = feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0);
    const averageRating = totalRating / feedbacks.length;

    const goodRatings = feedbacks.filter(feedback => feedback.rating >= 4).length;
    const goodPercentage = (goodRatings / feedbacks.length) * 100;

    return {
        averageRating: Number(averageRating.toFixed(1)),
        goodPercentage: Number(goodPercentage.toFixed(0))
    };
}

function DashboardHeader({ projectRoom }: DashboardHeaderProps) {
    const feedbacks = projectRoom?.data?.feedbacks || [];
    const tasks = projectRoom?.data?.tasks || [];

    const { averageRating, goodPercentage } = calculateRatingStats(feedbacks);
    const { growth, growthPercentage } = calculateFeedbackGrowth(feedbacks);
    const { activeTasks, tasksAddedToday } = calculateTaskStats(tasks);

    return (
        <div className="w-full flex-col pt-4 md:pt-16 px-4 md:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                <div className='space-y-2 md:space-y-4 p-4 rounded-lg'>
                    <p className="text-gray-400 text-sm md:text-base">Positive rating</p>
                    <p className="text-3xl md:text-5xl text-emerald-400">{goodPercentage}%</p>
                    <p className="text-gray-400 text-xs md:text-sm">
                        Overall rating <span className="text-emerald-400 ml-1">{averageRating}</span>
                    </p>
                </div>

                <div className='space-y-2 md:space-y-4 p-4 rounded-lg'>
                    <p className="text-gray-400 text-sm md:text-base">Total feedbacks</p>
                    <p className="text-3xl md:text-5xl text-blue-300">{feedbacks.length}</p>
                    <p className="text-gray-400 text-xs md:text-sm">
                        <span className={growth >= 0 ? "text-blue-300" : "text-red-300"}>
                            {growth >= 0 ? '+' : ''}{growthPercentage}%
                        </span>
                        <span className="ml-1">last month</span>
                    </p>
                </div>

                <div className='space-y-2 md:space-y-4 p-4 rounded-lg'>
                    <p className="text-gray-400 text-sm md:text-base">Weekly visitors</p>
                    <p className="text-3xl md:text-5xl text-purple-300">952</p>
                    <p className="text-gray-400 text-xs md:text-sm">
                        <span className="text-purple-300">5%</span> last week
                    </p>
                </div>

                <div className='space-y-2 md:space-y-4 p-4 rounded-lg'>
                    <p className="text-gray-400 text-sm md:text-base">Active tasks</p>
                    <p className="text-3xl md:text-5xl text-amber-300">{activeTasks}</p>
                    <p className="text-gray-400 text-xs md:text-sm">
                        <span className="text-amber-300">
                            {tasksAddedToday === 0 ? "No tasks" : `+${tasksAddedToday}`}
                        </span>
                        <span className="ml-1">assigned today</span>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default DashboardHeader