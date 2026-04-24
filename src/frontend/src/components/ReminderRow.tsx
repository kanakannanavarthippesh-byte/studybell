import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCheck, Pencil, Trash2, X } from "lucide-react";
import type { Reminder, ReminderStatus } from "../types/reminder";

interface ReminderRowProps {
  reminder: Reminder;
  index: number;
  onEdit: (reminder: Reminder) => void;
  onDelete: (reminder: Reminder) => void;
  onComplete: (id: bigint) => void;
  onDismiss: (id: bigint) => void;
  isCompleting: boolean;
  isDismissing: boolean;
}

const STATUS_LABELS: Record<ReminderStatus, string> = {
  pending: "Pending",
  completed: "Completed",
  dismissed: "Dismissed",
};

const STATUS_CLASSES: Record<ReminderStatus, string> = {
  pending: "status-pending border-primary/20",
  completed: "status-completed border-accent/20",
  dismissed: "status-dismissed border-border",
};

function formatDateTime(ns: bigint): string {
  const ms = Number(ns / 1_000_000n);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(ms));
}

export function ReminderRow({
  reminder,
  index,
  onEdit,
  onDelete,
  onComplete,
  onDismiss,
  isCompleting,
  isDismissing,
}: ReminderRowProps) {
  const isPending = reminder.status === "pending";

  return (
    <div
      className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-3.5 bg-card border border-border rounded-lg shadow-subtle hover:shadow-card transition-smooth group"
      data-ocid={`reminders.item.${index}`}
    >
      {/* Main info */}
      <div className="flex-1 min-w-0 space-y-0.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-foreground text-sm truncate max-w-[240px]">
            {reminder.title}
          </span>
          <Badge
            className={`text-xs px-2 py-0.5 border font-medium ${STATUS_CLASSES[reminder.status]}`}
            data-ocid={`reminders.status_badge.${index}`}
          >
            {STATUS_LABELS[reminder.status]}
          </Badge>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
          <span className="font-medium">{reminder.subject}</span>
          <span className="opacity-40">·</span>
          <span>{formatDateTime(reminder.scheduledAt)}</span>
        </div>
        {reminder.notes && (
          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5 opacity-70">
            {reminder.notes}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 shrink-0">
        {isPending && (
          <>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 px-2.5 text-xs text-accent hover:text-accent hover:bg-accent/10 gap-1"
              onClick={() => onComplete(reminder.id)}
              disabled={isCompleting}
              aria-label="Mark as completed"
              data-ocid={`reminders.complete_button.${index}`}
            >
              <CheckCheck className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Complete</span>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/60 gap-1"
              onClick={() => onDismiss(reminder.id)}
              disabled={isDismissing}
              aria-label="Dismiss reminder"
              data-ocid={`reminders.dismiss_button.${index}`}
            >
              <X className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Dismiss</span>
            </Button>
          </>
        )}

        <Button
          size="sm"
          variant="ghost"
          className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/60 gap-1"
          onClick={() => onEdit(reminder)}
          aria-label="Edit reminder"
          data-ocid={`reminders.edit_button.${index}`}
        >
          <Pencil className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Edit</span>
        </Button>

        <Button
          size="sm"
          variant="ghost"
          className="h-8 px-2.5 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 gap-1"
          onClick={() => onDelete(reminder)}
          aria-label="Delete reminder"
          data-ocid={`reminders.delete_button.${index}`}
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Delete</span>
        </Button>
      </div>
    </div>
  );
}
