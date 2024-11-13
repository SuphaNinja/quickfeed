import { Button } from "@/components/ui/button";
import { Feedback } from "./Feedbacks";
import { ChevronDown, ChevronUp, Clock } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type FilterType = "all" | "Negative" | "Neutral" | "Positive";
type SortType = "newest" | "oldest" | "last7days" | "last30days";

export function filterFeedback(feedback: Feedback, filter: FilterType) {
    if (filter === "all") return true;
    if (filter === "Negative" && (feedback.rating === 1 || feedback.rating === 2)) return true;
    if (filter === "Neutral" && feedback.rating === 3) return true;
    if (filter === "Positive" && (feedback.rating === 4 || feedback.rating === 5)) return true;
    return false;
}

export function sortFeedback(feedback: Feedback, sort: SortType) {
    if (!feedback.createdAt) return false;
    const now = new Date();
    const feedbackDate = new Date(feedback.createdAt);
    if (sort === "last7days") {
        return feedbackDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }
    if (sort === "last30days") {
        return feedbackDate >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
    return true;
}

export function sortByDate(a: Feedback, b: Feedback, sort: SortType) {
    if (!a.createdAt || !b.createdAt) return 0;

    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);

    if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) return 0;

    return sort === "newest"
        ? dateB.getTime() - dateA.getTime()
        : dateA.getTime() - dateB.getTime();
}



export function FilterButtons({ filter, setFilter }: { filter: FilterType; setFilter: (type: FilterType) => void }) {

    const filterButtons: { type: FilterType; label: string; className: string }[] = [
        { type: "all", label: "All", className: "bg-blue-500 hover:bg-blue-600" },
        { type: "Positive", label: "Positive", className: "bg-slate-500 dark:bg-[#E2E2E2]" },
        { type: "Neutral", label: "Neutral", className: "bg-[#343A40] dark:bg-[#E2E2E2]" },
        { type: "Negative", label: "Negative", className: "bg-[#343A40] dark:bg-[#E2E2E2]" },
    ];
    

    return (
        <div className="flex justify-evenly md:justify-start md:gap-2">
            {filterButtons.map((button) => (
                <Button
                    key={button.type}
                    className={`${button.className} rounded-lg ${filter === button.type ? "font-bold" : ""}`}
                    onClick={() => setFilter(button.type)}
                >
                    {button.label}
                </Button>
            ))}
        </div>
    );
}

export function SortSelect({ sort, setSort }: { sort: SortType, setSort: (type: SortType) => void }) {

    const sortOptions = [
        { icon: ChevronUp, value: "newest", title: "Newest" },
        { icon: ChevronDown, value: "oldest", title: "Oldest" },
        { icon: Clock, value: "last7days", title: "Last 7 days" },
        { icon: Clock, value: "last30days", title: "Last 30 days" },
    ];

    return (
        <div >
            <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="bg-transparent border-none focus:ring-0 ">
                    <div><SelectValue placeholder="Sort by" /></div>
                </SelectTrigger>
                <SelectContent className="bg-background/80 dark:bg-background/20 backdrop-blur-lg border-none">
                    {sortOptions.map((item) => (
                        <SelectItem key={item.value} value={item.value} className="hover:bg-background/90 dark:hover:bg-background/30 focus:bg-background/90 dark:focus:bg-background/30">
                            <div className="flex items-center gap-1 mr-1 justify-between w-full">
                                <span>{item.title}</span>
                                <item.icon className="h-4 w-4 text-muted-foreground" />
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}