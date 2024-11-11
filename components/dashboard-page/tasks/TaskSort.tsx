import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Task } from "@/lib/Types";

type SortType = "newest" | "oldest" | "priority" | "status";

const priorityOrder = {
    high: 0,
    medium: 1,
    low: 2
};

const statusOrder = {
    "in progress": 0,
    pending: 1,
    completed: 2
};

export function sortTasks(tasks: Task[], sort: SortType): Task[] {
    return [...tasks].sort((a, b) => {
        if (sort === "newest" || sort === "oldest") {
            return sortByDate(a, b, sort);
        } else if (sort === "priority") {
            return sortByPriority(a, b);
        } else if (sort === "status") {
            return sortByStatus(a, b);
        }
        return 0;
    });
}

function sortByDate(a: Task, b: Task, sort: SortType): number {
    if (!a.createdAt || !b.createdAt) return 0;

    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);

    if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) return 0;

    return sort === "newest"
        ? dateB.getTime() - dateA.getTime()
        : dateA.getTime() - dateB.getTime();
}

function sortByPriority(a: Task, b: Task): number {
    return (priorityOrder[a.priority as keyof typeof priorityOrder] || 0) -
        (priorityOrder[b.priority as keyof typeof priorityOrder] || 0);
}

function sortByStatus(a: Task, b: Task): number {
    return (statusOrder[a.status as keyof typeof statusOrder] || 0) -
        (statusOrder[b.status as keyof typeof statusOrder] || 0);
}

export function TaskSortSelect({ sort, setSort }: { sort: SortType, setSort: (type: SortType) => void }) {
    const sortOptions = [
        { icon: ChevronUp, value: "newest", title: "Newest" },
        { icon: ChevronDown, value: "oldest", title: "Oldest" },
        { icon: AlertTriangle, value: "priority", title: "Priority" },
        { icon: CheckCircle, value: "status", title: "Status" },
    ];

    return (
        <div>
            <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="bg-transparent border-none focus:ring-0">
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