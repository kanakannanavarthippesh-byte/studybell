import { useActor } from "@caffeineai/core-infrastructure";
import { useEffect, useRef, useState } from "react";
import { createActor } from "../backend";
import type { Reminder as BackendReminder, ReminderStatus } from "../backend";
import { useSilentMode } from "../context/SilentModeContext";
import type { Reminder } from "../types/reminder";
import { playReminderAlert } from "../utils/audio";

const POLL_INTERVAL = 30_000; // 30 seconds
const DUE_WINDOW_MS = 60_000; // 1 minute lookahead

function mapToReminder(r: BackendReminder): Reminder {
  const status = r.status as ReminderStatus as Reminder["status"];
  return {
    id: r.id,
    owner: r.owner.toString(),
    title: r.title,
    subject: r.subject,
    scheduledAt: r.scheduledAt,
    notes: r.notes,
    status,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  };
}

export function useReminderNotifier() {
  const { actor, isFetching } = useActor(createActor);
  const { isSilent } = useSilentMode();
  const [activeAlert, setActiveAlert] = useState<Reminder | null>(null);
  const firedIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!actor || isFetching) return;

    const checkDue = async () => {
      try {
        const reminders = await actor.listReminders();

        const now = Date.now();
        const dueReminders = reminders.map(mapToReminder).filter((r) => {
          if (r.status !== "pending") return false;
          const scheduledMs = Number(r.scheduledAt) / 1_000_000;
          return (
            scheduledMs <= now + DUE_WINDOW_MS && scheduledMs >= now - 5_000
          );
        });

        for (const reminder of dueReminders) {
          const key = reminder.id.toString();
          if (!firedIds.current.has(key)) {
            firedIds.current.add(key);
            if (!isSilent) {
              await playReminderAlert();
            }
            setActiveAlert(reminder);
            break; // show one at a time
          }
        }
      } catch (err) {
        console.warn("Reminder polling error:", err);
      }
    };

    checkDue();
    const interval = setInterval(checkDue, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [actor, isFetching, isSilent]);

  const dismissAlert = () => setActiveAlert(null);

  const snoozeAlert = (minutesFromNow: number) => {
    if (!activeAlert) return;
    const snoozeDelay = minutesFromNow * 60_000;
    const key = activeAlert.id.toString();
    // Re-allow firing after snooze window by removing from fired set later
    setTimeout(() => {
      firedIds.current.delete(key);
    }, snoozeDelay);
    setActiveAlert(null);
  };

  return { activeAlert, dismissAlert, snoozeAlert };
}
