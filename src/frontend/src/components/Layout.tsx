import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Link, useRouter } from "@tanstack/react-router";
import {
  Bell,
  BellOff,
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import type { ReactNode } from "react";
import { useSilentMode } from "../context/SilentModeContext";
import { useReminderNotifier } from "../hooks/useReminderNotifier";
import { AlertModal } from "./AlertModal";

interface LayoutProps {
  children: ReactNode;
}

function NavLink({
  to,
  icon: Icon,
  label,
  ocid,
}: {
  to: string;
  icon: React.ElementType;
  label: string;
  ocid: string;
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-smooth [&.active]:text-primary [&.active]:bg-primary/10"
      data-ocid={ocid}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}

export function Layout({ children }: LayoutProps) {
  const { clear } = useInternetIdentity();
  const { isSilent, toggleSilent } = useSilentMode();
  const { activeAlert, dismissAlert, snoozeAlert } = useReminderNotifier();
  const router = useRouter();

  const handleLogout = () => {
    clear();
    router.navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border shadow-card">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          {/* Brand */}
          <Link
            to="/dashboard"
            className="flex items-center gap-2 shrink-0"
            data-ocid="nav.logo_link"
          >
            <div className="p-1.5 rounded-lg bg-primary/10">
              <GraduationCap className="h-5 w-5 text-primary" />
            </div>
            <span className="font-display font-semibold text-foreground text-base tracking-tight">
              StudyBell
            </span>
          </Link>

          {/* Nav */}
          <nav className="flex items-center gap-1" aria-label="Main navigation">
            <NavLink
              to="/dashboard"
              icon={LayoutDashboard}
              label="Dashboard"
              ocid="nav.dashboard_link"
            />
            <NavLink
              to="/reminders"
              icon={BookOpen}
              label="Reminders"
              ocid="nav.reminders_link"
            />
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSilent}
              aria-label={isSilent ? "Enable sound" : "Mute sound"}
              data-ocid="nav.silent_toggle"
              className="relative"
            >
              {isSilent ? (
                <BellOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Bell className="h-4 w-4 text-foreground" />
              )}
              {isSilent && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-destructive" />
              )}
            </Button>

            <Separator orientation="vertical" className="h-5" />

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-foreground gap-1.5"
              data-ocid="nav.logout_button"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline text-xs">Sign out</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 bg-background">{children}</main>

      {/* Footer */}
      <footer className="bg-muted/40 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <GraduationCap className="h-3.5 w-3.5" />
            StudyBell — audio-first study reminders
          </span>
          <span>
            © {new Date().getFullYear()}.{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Built with love using caffeine.ai
            </a>
          </span>
        </div>
      </footer>

      {/* Alert modal */}
      {activeAlert && (
        <AlertModal
          reminder={activeAlert}
          onDismiss={dismissAlert}
          onSnooze={snoozeAlert}
        />
      )}
    </div>
  );
}
