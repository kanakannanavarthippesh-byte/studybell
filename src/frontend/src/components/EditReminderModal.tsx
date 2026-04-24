import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { useUpdateReminder } from "../hooks/useReminders";
import type { Reminder, UpdateReminderInput } from "../types/reminder";

interface EditReminderModalProps {
  reminder: Reminder | null;
  onClose: () => void;
}

function toDatetimeLocal(ns: bigint): string {
  const ms = Number(ns / 1_000_000n);
  const d = new Date(ms);
  // Format as YYYY-MM-DDTHH:mm
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromDatetimeLocal(value: string): bigint {
  return BigInt(new Date(value).getTime()) * 1_000_000n;
}

export function EditReminderModal({
  reminder,
  onClose,
}: EditReminderModalProps) {
  const updateMutation = useUpdateReminder();

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (reminder) {
      setTitle(reminder.title);
      setSubject(reminder.subject);
      setScheduledAt(toDatetimeLocal(reminder.scheduledAt));
      setNotes(reminder.notes ?? "");
    }
  }, [reminder]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reminder) return;

    const input: UpdateReminderInput = {
      id: reminder.id,
      title: title.trim(),
      subject: subject.trim(),
      scheduledAt: fromDatetimeLocal(scheduledAt),
      notes: notes.trim() || undefined,
    };

    await updateMutation.mutateAsync(input);
    onClose();
  };

  const isOpen = reminder !== null;

  return (
    <Dialog open={isOpen} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md" data-ocid="edit_reminder.dialog">
        <DialogHeader>
          <DialogTitle>Edit Reminder</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <Label htmlFor="edit-title">Title</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Review Chapter 5"
              required
              data-ocid="edit_reminder.title_input"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-subject">Subject</Label>
            <Input
              id="edit-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Mathematics"
              required
              data-ocid="edit_reminder.subject_input"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-scheduled">Scheduled At</Label>
            <Input
              id="edit-scheduled"
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              required
              data-ocid="edit_reminder.scheduled_input"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-notes">Notes (optional)</Label>
            <Textarea
              id="edit-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any extra notes…"
              rows={3}
              data-ocid="edit_reminder.notes_textarea"
            />
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              data-ocid="edit_reminder.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateMutation.isPending}
              data-ocid="edit_reminder.save_button"
            >
              {updateMutation.isPending ? "Saving…" : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
