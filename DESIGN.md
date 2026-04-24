# Study Reminder Design System

## Purpose
Audio-first study reminder app for students. Minimalist productivity interface prioritizing clarity and scanability. Sound is the primary alerting mechanism; UI supports the audio experience.

## Tone
Focused yet approachable. Calm, intentional, zero decoration. Emphasis on action (CTAs) and success states (completed reminders).

## Color Palette

| Token | Light OKLCH | Dark OKLCH | Usage |
|-------|-------------|-----------|-------|
| Primary (Indigo) | 0.55 0.25 257 | 0.72 0.21 257 | CTAs, active states, reminder highlight |
| Secondary (Grey) | 0.92 0.04 264 | 0.22 0.02 264 | Subtle backgrounds, disabled states |
| Accent (Emerald) | 0.65 0.22 142 | 0.68 0.19 142 | Success indicators, completed reminders |
| Destructive (Red) | 0.55 0.24 25 | 0.65 0.22 25 | Delete, dismiss, danger actions |
| Background | 0.98 0 0 | 0.12 0 0 | Page background |
| Foreground | 0.2 0 0 | 0.92 0 0 | Body text |
| Card | 0.99 0 0 | 0.16 0 0 | Reminder cards, elevated surfaces |
| Border | 0.91 0 0 | 0.25 0 0 | Dividers, input borders |

## Typography

| Role | Font | Usage |
|------|------|-------|
| Display | DM Sans 600 | Page titles, reminder alerts |
| Body | DM Sans 400 | Body text, card content, labels |
| Mono | JetBrains Mono 400 | Timer displays, codes |

## Structural Zones

| Zone | Background | Border | Shadow | Treatment |
|------|-----------|--------|--------|-----------|
| Header | card | border | none | Sticky nav, logout button, subtle elevation via border |
| Hero Dashboard | background | none | none | Clean container for upcoming reminders |
| Reminder Cards | card | border | card | Soft shadows, padding 1rem, radius 8px |
| Alert Modal | background | none | elevated | Full-screen with transparent overlay, large title |
| Footer | background | border-t | none | Minimal; actions only if needed |

## Shape Language
- Border radius: 8px (cards, buttons), 4px (small inputs), 24px (full buttons)
- Spacing: 1rem grid (8px base unit)
- Shadows: Subtle card shadow (0 2px 8px), elevated shadow for alerts (0 10px 25px)
- No gradients. Solid colors only.

## Component Patterns
- **Button**: Primary indigo, secondary grey, destructive red; 8px radius, 0.75rem padding
- **Card**: White/dark card background, subtle border, 2px box-shadow
- **Input**: Grey border, light background, focus ring indigo
- **Badge**: Muted background, foreground text; 4px radius
- **Countdown Timer**: Mono font, large (1.5rem+), bold weight

## Motion
- Transitions: 0.3s cubic-bezier(0.4, 0, 0.2, 1) for all interactive elements
- Alert pulse: Subtle 2s opacity pulse (opacity 1 → 0.8) on reminder alert badge
- No bounces, no springs. Calm, deliberate motion.

## Accessibility
- Minimum AA contrast on all text/background pairs
- All interactive elements keyboard accessible
- Audio alerts have visual fallback (badge pulse, modal focus)
- High-contrast mode: border width increases, shadow depth increases

## Signature Detail
Audio-first UX: Reminder cards show visual status, but sound triggers the primary alert. Design does not compete with audio — it supports and reinforces it.

## Constraints
- Dark mode default for evening study sessions; light mode available
- No animations on initial page load (reduce cognitive load)
- Reminder list shows max 5 upcoming in dashboard; full list in separate view
- Alert modal is modal-stacked (cannot dismiss by clicking background; snooze/dismiss buttons only)
