import type { backendInterface, Reminder, ReminderStatus } from "../backend";

const now = BigInt(Date.now()) * BigInt(1_000_000);
const hour = BigInt(3600) * BigInt(1_000_000_000);

const mockReminders: Reminder[] = [
  {
    id: BigInt(1),
    title: "Math Study Session",
    subject: "Calculus",
    owner: { toText: () => "aaaaa-aa" } as any,
    createdAt: now - hour * BigInt(2),
    updatedAt: now - hour * BigInt(2),
    scheduledAt: now + hour,
    status: "pending" as unknown as ReminderStatus,
    notes: "Review derivatives and integrals chapters 5-7",
  },
  {
    id: BigInt(2),
    title: "Chemistry Review",
    subject: "Organic Chemistry",
    owner: { toText: () => "aaaaa-aa" } as any,
    createdAt: now - hour * BigInt(5),
    updatedAt: now - hour * BigInt(5),
    scheduledAt: now + hour * BigInt(3),
    status: "pending" as unknown as ReminderStatus,
    notes: "Focus on reaction mechanisms",
  },
  {
    id: BigInt(3),
    title: "History Essay",
    subject: "World History",
    owner: { toText: () => "aaaaa-aa" } as any,
    createdAt: now - hour * BigInt(24),
    updatedAt: now - hour * BigInt(10),
    scheduledAt: now - hour * BigInt(2),
    status: "completed" as unknown as ReminderStatus,
    notes: "Essay on industrial revolution",
  },
  {
    id: BigInt(4),
    title: "Physics Problem Set",
    subject: "Physics",
    owner: { toText: () => "aaaaa-aa" } as any,
    createdAt: now - hour * BigInt(48),
    updatedAt: now - hour * BigInt(48),
    scheduledAt: now - hour * BigInt(6),
    status: "dismissed" as unknown as ReminderStatus,
  },
];

export const mockBackend: backendInterface = {
  listReminders: async () => mockReminders,

  getReminder: async (id) => mockReminders.find((r) => r.id === id) ?? null,

  createReminder: async (input) => ({
    id: BigInt(Date.now()),
    title: input.title,
    subject: input.subject,
    notes: input.notes,
    scheduledAt: input.scheduledAt,
    owner: { toText: () => "aaaaa-aa" } as any,
    createdAt: now,
    updatedAt: now,
    status: "pending" as unknown as ReminderStatus,
  }),

  updateReminder: async (input) => {
    const found = mockReminders.find((r) => r.id === input.id);
    if (!found) return null;
    return { ...found, ...input, updatedAt: now };
  },

  deleteReminder: async (_id) => true,

  completeReminder: async (id) => {
    const found = mockReminders.find((r) => r.id === id);
    if (!found) return null;
    return { ...found, status: "completed" as unknown as ReminderStatus, updatedAt: now };
  },

  dismissReminder: async (id) => {
    const found = mockReminders.find((r) => r.id === id);
    if (!found) return null;
    return { ...found, status: "dismissed" as unknown as ReminderStatus, updatedAt: now };
  },
};
