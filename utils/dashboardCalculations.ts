// dashboardCalculations.ts
import { Task, Feedback } from "@/lib/Types";

export const calculateTaskStats = (tasks: Task[]) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const activeTasks = tasks.filter(task => ["in progress", "pending"].includes(task.status)).length;
  const tasksAddedToday = tasks.filter(task => new Date(task.createdAt) >= today).length;

  return { activeTasks, tasksAddedToday };
};

export const calculateFeedbackGrowth = (feedbacks: Feedback[]) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const currentMonthFeedbacks = feedbacks.filter(fb => {
    const date = new Date(fb.createdAt);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  const lastMonthFeedbacks = feedbacks.filter(fb => {
    const date = new Date(fb.createdAt);
    return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
  });

  const growth = currentMonthFeedbacks.length - lastMonthFeedbacks.length;
  const growthPercentage = lastMonthFeedbacks.length
    ? ((growth / lastMonthFeedbacks.length) * 100).toFixed(0)
    : "N/A";

  return { growth, growthPercentage };
};

export const calculateRatingStats = (feedbacks: Feedback[]) => {
  if (!feedbacks.length) return { averageRating: 0, goodPercentage: 0 };

  const totalRating = feedbacks.reduce((acc, fb) => acc + fb.rating, 0);
  const averageRating = totalRating / feedbacks.length;
  const goodRatings = feedbacks.filter(fb => fb.rating >= 4).length;
  const goodPercentage = (goodRatings / feedbacks.length) * 100;

  return { averageRating: +averageRating.toFixed(1), goodPercentage: +goodPercentage.toFixed(0) };
};
