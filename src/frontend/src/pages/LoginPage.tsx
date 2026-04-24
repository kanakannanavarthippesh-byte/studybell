import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Bell, BookOpen, GraduationCap, Shield } from "lucide-react";

const FEATURES = [
  {
    icon: Bell,
    title: "Audio Alerts",
    description:
      "Real sound chimes when your study session begins — not just a silent notification.",
  },
  {
    icon: BookOpen,
    title: "Smart Scheduling",
    description:
      "Set reminders for any subject with custom notes and flexible snooze options.",
  },
  {
    icon: Shield,
    title: "Your Data, Your Control",
    description:
      "Login with Internet Identity — decentralized, private, no passwords needed.",
  },
] as const;

export default function LoginPage() {
  const { login, loginStatus } = useInternetIdentity();

  const isLoading = loginStatus === "logging-in";

  return (
    <div
      className="min-h-screen bg-background flex flex-col"
      data-ocid="login.page"
    >
      {/* Minimal header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <GraduationCap className="h-5 w-5 text-primary" />
          </div>
          <span className="font-display font-semibold text-foreground tracking-tight">
            StudyBell
          </span>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md text-center space-y-8">
          {/* Icon glow */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl scale-150" />
              <div className="relative p-5 rounded-full bg-primary/10 border border-primary/20">
                <Bell className="h-10 w-10 text-primary" />
              </div>
            </div>
          </div>

          <div>
            <h1 className="font-display text-4xl font-bold text-foreground mb-3 tracking-tight">
              Stay on Track.
              <br />
              <span className="text-primary">Sound the bell.</span>
            </h1>
            <p className="text-muted-foreground text-base leading-relaxed">
              StudyBell sends you audio reminders when it's time to study — so
              you never miss a session.
            </p>
          </div>

          {/* CTA */}
          <div className="space-y-3">
            <Button
              size="lg"
              className="w-full gap-2 text-base h-12"
              onClick={() => login()}
              disabled={isLoading}
              data-ocid="login.primary_button"
            >
              {isLoading ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground animate-spin" />
                  Connecting…
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4" />
                  Sign in with Internet Identity
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground">
              Decentralized login — no email, no password, no tracking.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-muted/30 border-t border-border px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <Card
                key={title}
                className="bg-card border-border p-5 space-y-3 shadow-card"
              >
                <div className="p-2 w-fit rounded-lg bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-sm text-foreground mb-1">
                    {title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-center text-xs text-muted-foreground">
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
    </div>
  );
}
