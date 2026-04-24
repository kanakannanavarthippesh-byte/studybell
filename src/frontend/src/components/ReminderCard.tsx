import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import type { Reminder } from "../types/reminder";

interface TimeRemaining {
  label: string;
  isPast: boolean;
}

function getTimeRemaining(scheduledAt: bigint): TimeRemaining {
  const now = Date.now();
  const scheduled = Number(scheduledAt) / 1_000_000; // ns → ms
  const diff = scheduled - now;
  const isPast = diff < 0;
  const abs = Math.abs(diff);

  const totalMinutes = Math.floor(abs / 60_000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  let label: string;
  if (abs < 60_000) {
    label = isPast ? "just now" : "in < 1 min";
  } else if (hours === 0) {
    label = isPast ? `${minutes}m ago` : `in ${minutes}m`;
  } else if (hours < 24) {
    label = isPast ? `${hours}h ${minutes}m ago` : `in ${hours}h ${minutes}m`;
  } else {
    const days = Math.floor(hours / 24);
    label = isPast ? `${days}d ago` : `in ${days}d`;
  }
  return { label, isPast };
}

function formatDateTime(scheduledAt: bigint): string {
  const ms = Number(scheduledAt) / 1_000_000;
  return new Date(ms).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface ReminderCardProps {
  reminder: Reminder;
  index: number;
  onComplete?: (id: bigint) => void;
  onDismiss?: (id: bigint) => void;
}

export function ReminderCard({
  reminder,
  index,
  onComplete,
  onDismiss,
}: ReminderCardProps) {
  const { label: timeLabel, isPast } = getTimeRemaining(reminder.scheduledAt);
  const isOverdue = isPast && reminder.status === "pending";

  return (
    <Card
      className={`relative overflow-hidden transition-smooth hover:shadow-elevated ${
        isOverdue
          ? "border-destructive/50 bg-destructive/5"
          : "border-border bg-card"
      }`}
      data-ocid={`reminder.item.${index}`}
    >
      {isOverdue && (
        <div className="absolute top-0 left-0 w-1 h-full bg-destructive rounded-l-lg" />
      )}
      <CardContent className="p-4 pl-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Title + overdue badge */}
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-display font-semibold text-foreground truncate">
                {reminder.title}
              </h3>
              {isOverdue && (
                <Badge variant="destructive" className="text-xs shrink-0">
                  Overdue
                </Badge>
              )}
            </div>

            {/* Subject */}
            <p className="text-sm text-muted-foreground truncate mb-2">
              {reminder.subject}
            </p>

            {/* Time info */}
            <div className="flex items-center gap-3 flex-wrap">
              <span
                className={`flex items-center gap-1 text-xs font-medium ${
                  isOverdue ? "text-destructive" : "text-primary"
                } ${isOverdue ? "alert-pulse" : ""}`}
                data-ocid={`reminder.time_label.${index}`}
              >
                <Clock className="h-3 w-3" />
                {timeLabel}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatDateTime(reminder.scheduledAt)}
              </span>
            </div>
          </div>

          {/* Actions */}
          {reminder.status === "pending" && (onComplete || onDismiss) && (
            <div className="flex items-center gap-1 shrink-0">
              {onComplete && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-accent hover:text-accent hover:bg-accent/10"
                  onClick={() => onComplete(reminder.id)}
                  aria-label="Mark complete"
                  data-ocid={`reminder.complete_button.${index}`}
                >
                  <CheckCircle2 className="h-4 w-4" />
                </Button>
              )}
              {onDismiss && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  onClick={() => onDismiss(reminder.id)}
                  aria-label="Dismiss reminder"
                  data-ocid={`reminder.dismiss_button.${index}`}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
