export type ReminderStatus = "pending" | "completed" | "dismissed";

export interface Reminder {
  id: bigint;
  owner: string;
  title: string;
  subject: string;
  scheduledAt: bigint;
  notes?: string;
  status: ReminderStatus;
  createdAt: bigint;
  updatedAt: bigint;
}

export interface CreateReminderInput {
  title: string;
  subject: string;
  scheduledAt: bigint;
  notes?: string;
}

export interface UpdateReminderInput {
  id: bigint;
  title: string;
  subject: string;
  scheduledAt: bigint;
  notes?: string;
}
