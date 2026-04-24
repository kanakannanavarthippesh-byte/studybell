import { Button } from "@/components/ui/button";
import { Bell, BellOff, Clock, X } from "lucide-react";
import { useSilentMode } from "../context/SilentModeContext";
import type { Reminder } from "../types/reminder";
import { playSnoozeConfirm } from "../utils/audio";

interface AlertModalProps {
  reminder: Reminder;
  onDismiss: () => void;
  onSnooze: (minutes: number) => void;
}

const SNOOZE_OPTIONS = [5, 10, 15] as const;

function formatScheduledTime(scheduledAt: bigint): string {
  const ms = Number(scheduledAt) / 1_000_000;
  return new Date(ms).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AlertModal({ reminder, onDismiss, onSnooze }: AlertModalProps) {
  const { isSilent } = useSilentMode();

  const handleSnooze = async (minutes: number) => {
    if (!isSilent) {
      await playSnoozeConfirm();
    }
    onSnooze(minutes);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="alert-title"
      data-ocid="alert.dialog"
    >
      {/* Backdrop — no click dismiss */}
      <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" />

      <div className="relative z-10 w-full max-w-md mx-4 rounded-2xl bg-card border border-border shadow-elevated overflow-hidden">
        {/* Pulsing top accent */}
        <div className="h-1 w-full bg-primary alert-pulse" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <div className="flex items-center gap-2 text-primary">
            <div className="p-2 rounded-full bg-primary/10 alert-pulse">
              {isSilent ? (
                <BellOff className="h-5 w-5" />
              ) : (
                <Bell className="h-5 w-5" />
              )}
            </div>
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
              Study Reminder
            </span>
          </div>
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground transition-colors"
            onClick={onDismiss}
            aria-label="Dismiss reminder"
            data-ocid="alert.close_button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 text-center">
          <h2
            id="alert-title"
            className="text-2xl font-display font-semibold text-foreground mb-1"
          >
            {reminder.title}
          </h2>
          <p className="text-muted-foreground text-sm mb-4">
            {reminder.subject}
          </p>

          {reminder.notes && (
            <p className="text-sm text-foreground/80 bg-muted/50 rounded-lg px-4 py-2 mb-4 text-left">
              {reminder.notes}
            </p>
          )}

          <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground mb-6">
            <Clock className="h-3.5 w-3.5" />
            <span>
              Scheduled at {formatScheduledTime(reminder.scheduledAt)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 space-y-3">
          <div className="grid grid-cols-3 gap-2">
            {SNOOZE_OPTIONS.map((min) => (
              <Button
                key={min}
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => handleSnooze(min)}
                data-ocid={`alert.snooze_${min}_button`}
              >
                Snooze {min}m
              </Button>
            ))}
          </div>
          <Button
            variant="default"
            className="w-full"
            onClick={onDismiss}
            data-ocid="alert.dismiss_button"
          >
            Got it — Dismiss
          </Button>
        </div>
      </div>
    </div>
  );
}
