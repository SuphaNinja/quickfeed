import { Feedback } from "./Feedbacks";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, UserIcon } from "lucide-react";

export default function FeedbackItem({ feedback }: { feedback: Feedback }) {
  const ratingClass =
    feedback.rating === 1 || feedback.rating === 2
      ? "bg-red-600 dark:bg-red-700"
      : feedback.rating === 3
      ? "bg-yellow-400 dark:bg-yellow-500"
      : "bg-green-500 dark:bg-green-600";

  return (
    <li className="flex justify-between gap-4 py-5 border-b  border-[#141414]">
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-medium leading-snug flex-grow">
          {feedback.message}
        </h3>
        <div className="flex gap-2 text-muted-foreground text-xs">
          {feedback.name && (
            <span className="flex items-center">
              <UserIcon className="w-3 h-3 mr-1.5" />
              <span className="font-medium">{feedback.name}</span>
            </span>
          )}
          <span className="flex items-center">
            <CalendarIcon className="w-3 h-3 mr-1.5" />
            <span>{formatDate(feedback.createdAt)}</span>
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3 mt-1">
        <div className="flex flex-col sm:flex-row justify-between items-start w-full gap-2">
          <Badge
            variant="secondary"
            className={`${ratingClass} self-start sm:self-center whitespace-nowrap`}
          >
            Rating: {feedback.rating}
          </Badge>
        </div>
      </div>
    </li>
  );
}

const formatDate = (date: string | Date | null): string => {
  if (!date) return "No date available";
  const dateObject = date instanceof Date ? date : new Date(date);
  if (isNaN(dateObject.getTime())) return "Invalid date";
  return dateObject.toISOString().split("T")[0];
};
