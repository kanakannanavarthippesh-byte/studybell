import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpen,
  CheckCircle2,
  Plus,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { CreateReminderModal } from "../components/CreateReminderModal";
import { ReminderCard } from "../components/ReminderCard";
import {
  useCompleteReminder,
  useDismissReminder,
  useReminders,
} from "../hooks/useReminders";
import type { Reminder } from "../types/reminder";

// ─── helpers ────────────────────────────────────────────────────────────────

function isToday(ms: number): boolean {
  const d = new Date(ms);
  const t = new Date();
  return (
    d.getDate() === t.getDate() &&
    d.getMonth() === t.getMonth() &&
    d.getFullYear() === t.getFullYear()
  );
}

function isThisWeek(ms: number): boolean {
  const now = Date.now();
  const start = now - 7 * 24 * 60 * 60_000;
  return ms >= start && ms <= now;
}

function toMs(ns: bigint): number {
  return Number(ns) / 1_000_000;
}

// ─── sub-components ──────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  ocid,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  ocid: string;
}) {
  return (
    <Card className="bg-card border-border" data-ocid={ocid}>
      <CardContent className="p-5 flex items-center gap-4">
        <div className="p-2.5 rounded-xl bg-primary/10 shrink-0">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div className="min-w-0">
          <p className="text-2xl font-display font-bold text-foreground leading-none mb-1">
            {value}
          </p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function CardSkeleton() {
  return (
    <Card className="border-border bg-card">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </CardContent>
    </Card>
  );
}

// ─── main page ───────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const { data: reminders = [], isLoading } = useReminders();
  const { mutate: complete } = useCompleteReminder();
  const { mutate: dismiss } = useDismissReminder();

  const now = Date.now();

  // upcoming: pending, sorted by scheduledAt, top 5
  const upcoming: Reminder[] = reminders
    .filter((r) => r.status === "pending")
    .sort((a, b) => Number(a.scheduledAt - b.scheduledAt))
    .slice(0, 5);

  // stats
  const completedToday = reminders.filter(
    (r) => r.status === "completed" && isToday(toMs(r.updatedAt)),
  ).length;

  const completedThisWeek = reminders.filter(
    (r) => r.status === "completed" && isThisWeek(toMs(r.updatedAt)),
  ).length;

  const overdueCount = reminders.filter(
    (r) => r.status === "pending" && toMs(r.scheduledAt) < now,
  ).length;

  return (
    <div
      className="max-w-3xl mx-auto px-4 py-8 space-y-8"
      data-ocid="dashboard.page"
    >
      {/* Header row */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground leading-tight">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Your upcoming study reminders at a glance
          </p>
        </div>
        <Button
          onClick={() => setModalOpen(true)}
          className="gap-2 font-medium"
          data-ocid="dashboard.add_reminder_button"
        >
          <Plus className="h-4 w-4" />
          Add Reminder
        </Button>
      </div>

      {/* Stats */}
      <section aria-label="Statistics" data-ocid="dashboard.stats_section">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <StatCard
            icon={CheckCircle2}
            label="Completed today"
            value={completedToday}
            ocid="dashboard.stat_today"
          />
          <StatCard
            icon={TrendingUp}
            label="Completed this week"
            value={completedThisWeek}
            ocid="dashboard.stat_week"
          />
          {overdueCount > 0 && (
            <Card
              className="bg-destructive/5 border-destructive/30"
              data-ocid="dashboard.stat_overdue"
            >
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-destructive/10 shrink-0">
                  <BookOpen className="h-5 w-5 text-destructive" />
                </div>
                <div className="min-w-0">
                  <p className="text-2xl font-display font-bold text-destructive leading-none mb-1">
                    {overdueCount}
                  </p>
                  <p className="text-xs text-muted-foreground">Overdue</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Upcoming reminders */}
      <section
        aria-label="Upcoming reminders"
        data-ocid="dashboard.upcoming_section"
      >
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <CardTitle className="font-display text-base font-semibold text-foreground flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Upcoming Reminders
              </CardTitle>
              {upcoming.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {upcoming.length} of{" "}
                  {reminders.filter((r) => r.status === "pending").length}{" "}
                  pending
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-0 pb-4">
            {isLoading ? (
              <div className="space-y-3" data-ocid="dashboard.loading_state">
                {(["s1", "s2", "s3"] as const).map((k) => (
                  <CardSkeleton key={k} />
                ))}
              </div>
            ) : upcoming.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-12 text-center space-y-3"
                data-ocid="dashboard.empty_state"
              >
                <div className="p-4 rounded-full bg-primary/10">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="font-display font-semibold text-foreground">
                    No upcoming reminders
                  </p>
                  <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                    You're all caught up! Add a new reminder to stay on top of
                    your studies.
                  </p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setModalOpen(true)}
                  className="mt-1 gap-1.5"
                  data-ocid="dashboard.empty_add_button"
                >
                  <Plus className="h-4 w-4" />
                  Add your first reminder
                </Button>
              </div>
            ) : (
              <div className="space-y-3" data-ocid="dashboard.reminder_list">
                {upcoming.map((reminder, i) => (
                  <ReminderCard
                    key={reminder.id.toString()}
                    reminder={reminder}
                    index={i + 1}
                    onComplete={(id) => complete(id)}
                    onDismiss={(id) => dismiss(id)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Create modal */}
      <CreateReminderModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}
