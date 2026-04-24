import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type UserId = Principal;
export type Timestamp = bigint;
export type ReminderId = bigint;
export interface Reminder {
    id: ReminderId;
    status: ReminderStatus;
    title: string;
    subject: string;
    owner: UserId;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    notes?: string;
    scheduledAt: Timestamp;
}
export interface UpdateReminderInput {
    id: ReminderId;
    title: string;
    subject: string;
    notes?: string;
    scheduledAt: Timestamp;
}
export interface CreateReminderInput {
    title: string;
    subject: string;
    notes?: string;
    scheduledAt: Timestamp;
}
export enum ReminderStatus {
    pending = "pending",
    completed = "completed",
    dismissed = "dismissed"
}
export interface backendInterface {
    completeReminder(id: ReminderId): Promise<Reminder | null>;
    createReminder(input: CreateReminderInput): Promise<Reminder>;
    deleteReminder(id: ReminderId): Promise<boolean>;
    dismissReminder(id: ReminderId): Promise<Reminder | null>;
    getReminder(id: ReminderId): Promise<Reminder | null>;
    listReminders(): Promise<Array<Reminder>>;
    updateReminder(input: UpdateReminderInput): Promise<Reminder | null>;
}
