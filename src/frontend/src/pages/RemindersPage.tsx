import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "@tanstack/react-router";
import { Bell, BellPlus, BookOpen } from "lucide-react";
import { useState } from "react";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { EditReminderModal } from "../components/EditReminderModal";
import { ReminderRow } from "../components/ReminderRow";
import {
  useCompleteReminder,
  useDeleteReminder,
  useDismissReminder,
  useReminders,
} from "../hooks/useReminders";
import type { Reminder, ReminderStatus } from "../types/reminder";

type FilterTab = "all" | ReminderStatus;

const FILTER_TABS: {
  key: FilterTab;
  label: string;
  countFilter?: ReminderStatus;
}[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Upcoming", countFilter: "pending" },
  { key: "completed", label: "Completed", countFilter: "completed" },
  { key: "dismissed", label: "Dismissed", countFilter: "dismissed" },
];

const EMPTY_MESSAGES: Record<FilterTab, { title: string; body: string }> = {
  all: {
    title: "No reminders yet",
    body: "Head to the Dashboard to create your first study reminder.",
  },
  pending: {
    title: "No upcoming reminders",
    body: "All caught up! Create a new reminder from the Dashboard.",
  },
  completed: {
    title: "Nothing completed yet",
    body: "Reminders you finish will show up here.",
  },
  dismissed: {
    title: "No dismissed reminders",
    body: "Reminders you skip will appear here.",
  },
};

function LoadingSkeleton() {
  return (
    <div className="space-y-2.5">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="flex items-center gap-3 px-4 py-3.5 bg-card border border-border rounded-lg"
        >
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-72" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-7 w-20" />
            <Skeleton className="h-7 w-14" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ tab }: { tab: FilterTab }) {
  const { title, body } = EMPTY_MESSAGES[tab];
  return (
    <div
      className="flex flex-col items-center justify-center py-20 text-center gap-4"
      data-ocid="reminders.empty_state"
    >
      <div className="p-4 rounded-full bg-primary/10">
        <BookOpen className="h-8 w-8 text-primary opacity-60" />
      </div>
      <div>
        <p className="font-semibold text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground mt-1 max-w-xs">{body}</p>
      </div>
    </div>
  );
}

export default function RemindersPage() {
  const { data: reminders = [], isLoading } = useReminders();
  const completeMutation = useCompleteReminder();
  const dismissMutation = useDismissReminder();
  const deleteMutation = useDeleteReminder();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [editTarget, setEditTarget] = useState<Reminder | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Reminder | null>(null);

  // Sort descending by scheduledAt
  const sorted = [...reminders].sort((a, b) =>
    a.scheduledAt > b.scheduledAt ? -1 : a.scheduledAt < b.scheduledAt ? 1 : 0,
  );

  const filtered = sorted.filter((r) =>
    activeTab === "all" ? true : r.status === activeTab,
  );

  const countFor = (status: ReminderStatus) =>
    reminders.filter((r) => r.status === status).length;

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    await deleteMutation.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <div
      className="max-w-4xl mx-auto px-4 py-8 space-y-6"
      data-ocid="reminders.page"
    >
      {/* Page header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <Bell className="h-6 w-6 text-primary" />
            Reminders
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage and track all your study reminders
          </p>
        </div>
        <Button
          variant="default"
          size="sm"
          className="gap-1.5 shrink-0"
          onClick={() => {
            void navigate({ to: "/dashboard" });
          }}
          data-ocid="reminders.new_reminder_button"
        >
          <BellPlus className="h-4 w-4" />
          <span className="hidden sm:inline">New Reminder</span>
        </Button>
      </div>

      {/* Filter tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as FilterTab)}
      >
        <TabsList className="bg-muted/60 h-9" data-ocid="reminders.filter.tab">
          {FILTER_TABS.map(({ key, label, countFilter }) => (
            <TabsTrigger
              key={key}
              value={key}
              className="text-xs px-3 gap-1.5"
              data-ocid={`reminders.filter_${key}`}
            >
              {label}
              {countFilter !== undefined && countFor(countFilter) > 0 && (
                <Badge className="text-[10px] h-4 px-1.5 bg-primary/15 text-primary border-0 font-semibold">
                  {countFor(countFilter)}
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Content */}
      <section className="space-y-2.5">
        {isLoading ? (
          <LoadingSkeleton />
        ) : filtered.length === 0 ? (
          <EmptyState tab={activeTab} />
        ) : (
          <ul
            className="space-y-2"
            data-ocid="reminders.list"
            aria-label="Reminders list"
          >
            {filtered.map((reminder, idx) => (
              <li key={String(reminder.id)} className="list-none">
                <ReminderRow
                  reminder={reminder}
                  index={idx + 1}
                  onEdit={setEditTarget}
                  onDelete={setDeleteTarget}
                  onComplete={(id) => completeMutation.mutate(id)}
                  onDismiss={(id) => dismissMutation.mutate(id)}
                  isCompleting={completeMutation.isPending}
                  isDismissing={dismissMutation.isPending}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Edit modal */}
      <EditReminderModal
        reminder={editTarget}
        onClose={() => setEditTarget(null)}
      />

      {/* Delete confirm dialog */}
      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete reminder?"
        description={
          deleteTarget
            ? `"${deleteTarget.title}" will be permanently removed. This cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        cancelLabel="Keep it"
        variant="destructive"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
