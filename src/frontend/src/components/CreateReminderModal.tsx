import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, PlusCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCreateReminder } from "../hooks/useReminders";

interface CreateReminderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormState {
  title: string;
  subject: string;
  datetime: string;
  notes: string;
}

const EMPTY: FormState = { title: "", subject: "", datetime: "", notes: "" };

export function CreateReminderModal({
  open,
  onOpenChange,
}: CreateReminderModalProps) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const { mutateAsync, isPending } = useCreateReminder();

  function handleChange(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate(): boolean {
    const next: Partial<FormState> = {};
    if (!form.title.trim()) next.title = "Title is required";
    if (!form.subject.trim()) next.subject = "Subject is required";
    if (!form.datetime) next.datetime = "Date & time is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    try {
      const scheduledMs = new Date(form.datetime).getTime();
      await mutateAsync({
        title: form.title.trim(),
        subject: form.subject.trim(),
        scheduledAt: BigInt(scheduledMs) * 1_000_000n, // ms → ns
        notes: form.notes.trim() || undefined,
      });
      toast.success("Reminder created!", {
        description: `"${form.title}" has been scheduled.`,
      });
      setForm(EMPTY);
      onOpenChange(false);
    } catch {
      toast.error("Failed to create reminder. Please try again.");
    }
  }

  function handleClose() {
    if (isPending) return;
    setForm(EMPTY);
    setErrors({});
    onOpenChange(false);
  }

  // Default datetime: now + 1 hour, rounded to next 5 min
  function getDefaultDatetime(): string {
    const d = new Date(Date.now() + 60 * 60_000);
    d.setMinutes(Math.ceil(d.getMinutes() / 5) * 5, 0, 0);
    return d.toISOString().slice(0, 16);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="sm:max-w-md bg-card border-border"
        data-ocid="create_reminder.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-foreground flex items-center gap-2">
            <PlusCircle className="h-5 w-5 text-primary" />
            New Reminder
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Schedule a study reminder with an audio alert.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {/* Title */}
          <div className="grid gap-1.5">
            <Label htmlFor="reminder-title" className="text-sm font-medium">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="reminder-title"
              placeholder="e.g. Review Chapter 5"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className={
                errors.title
                  ? "border-destructive focus-visible:ring-destructive"
                  : ""
              }
              data-ocid="create_reminder.title_input"
              maxLength={120}
            />
            {errors.title && (
              <p
                className="text-xs text-destructive"
                data-ocid="create_reminder.title_field_error"
              >
                {errors.title}
              </p>
            )}
          </div>

          {/* Subject */}
          <div className="grid gap-1.5">
            <Label htmlFor="reminder-subject" className="text-sm font-medium">
              Subject <span className="text-destructive">*</span>
            </Label>
            <Input
              id="reminder-subject"
              placeholder="e.g. Mathematics"
              value={form.subject}
              onChange={(e) => handleChange("subject", e.target.value)}
              className={
                errors.subject
                  ? "border-destructive focus-visible:ring-destructive"
                  : ""
              }
              data-ocid="create_reminder.subject_input"
              maxLength={80}
            />
            {errors.subject && (
              <p
                className="text-xs text-destructive"
                data-ocid="create_reminder.subject_field_error"
              >
                {errors.subject}
              </p>
            )}
          </div>

          {/* Date + Time */}
          <div className="grid gap-1.5">
            <Label htmlFor="reminder-datetime" className="text-sm font-medium">
              Date & Time <span className="text-destructive">*</span>
            </Label>
            <Input
              id="reminder-datetime"
              type="datetime-local"
              value={form.datetime || getDefaultDatetime()}
              onChange={(e) => handleChange("datetime", e.target.value)}
              className={
                errors.datetime
                  ? "border-destructive focus-visible:ring-destructive"
                  : ""
              }
              data-ocid="create_reminder.datetime_input"
            />
            {errors.datetime && (
              <p
                className="text-xs text-destructive"
                data-ocid="create_reminder.datetime_field_error"
              >
                {errors.datetime}
              </p>
            )}
          </div>

          {/* Notes */}
          <div className="grid gap-1.5">
            <Label htmlFor="reminder-notes" className="text-sm font-medium">
              Notes{" "}
              <span className="text-muted-foreground text-xs font-normal">
                (optional)
              </span>
            </Label>
            <Textarea
              id="reminder-notes"
              placeholder="Any extra details…"
              value={form.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              rows={2}
              className="resize-none"
              data-ocid="create_reminder.notes_textarea"
              maxLength={500}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="ghost"
            onClick={handleClose}
            disabled={isPending}
            data-ocid="create_reminder.cancel_button"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending}
            data-ocid="create_reminder.submit_button"
            className="gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <PlusCircle className="h-4 w-4" />
                Create Reminder
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
