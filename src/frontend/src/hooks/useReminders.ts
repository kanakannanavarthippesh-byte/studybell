import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { Reminder as BackendReminder, ReminderStatus } from "../backend";
import type {
  CreateReminderInput,
  Reminder,
  UpdateReminderInput,
} from "../types/reminder";

function mapStatus(s: ReminderStatus): Reminder["status"] {
  return s as Reminder["status"];
}

function mapReminder(r: BackendReminder): Reminder {
  return {
    id: r.id,
    owner: r.owner.toString(),
    title: r.title,
    subject: r.subject,
    scheduledAt: r.scheduledAt,
    notes: r.notes,
    status: mapStatus(r.status),
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  };
}

export function useReminders() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<Reminder[]>({
    queryKey: ["reminders"],
    queryFn: async () => {
      if (!actor) return [];
      const result = await actor.listReminders();
      return result.map(mapReminder);
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30_000,
  });
}

export function useCreateReminder() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateReminderInput) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.createReminder(input);
      return mapReminder(result);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reminders"] }),
  });
}

export function useUpdateReminder() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateReminderInput) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.updateReminder(input);
      if (!result) throw new Error("Reminder not found");
      return mapReminder(result);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reminders"] }),
  });
}

export function useDeleteReminder() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteReminder(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reminders"] }),
  });
}

export function useCompleteReminder() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.completeReminder(id);
      if (!result) throw new Error("Reminder not found");
      return mapReminder(result);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reminders"] }),
  });
}

export function useDismissReminder() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.dismissReminder(id);
      if (!result) throw new Error("Reminder not found");
      return mapReminder(result);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reminders"] }),
  });
}
