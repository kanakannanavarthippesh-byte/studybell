let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

function playTone(
  ctx: AudioContext,
  frequency: number,
  startTime: number,
  duration: number,
  gainValue: number,
): void {
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, startTime);

  gainNode.gain.setValueAtTime(0, startTime);
  gainNode.gain.linearRampToValueAtTime(gainValue, startTime + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  oscillator.start(startTime);
  oscillator.stop(startTime + duration + 0.05);
}

export async function playReminderAlert(): Promise<void> {
  try {
    const ctx = getAudioContext();
    await ctx.resume();
    const now = ctx.currentTime;

    // Three-note chime: C5 → E5 → G5
    playTone(ctx, 523.25, now, 0.4, 0.4);
    playTone(ctx, 659.25, now + 0.18, 0.4, 0.35);
    playTone(ctx, 783.99, now + 0.36, 0.6, 0.45);
  } catch (err) {
    console.warn("Audio playback failed:", err);
  }
}

export async function playSnoozeConfirm(): Promise<void> {
  try {
    const ctx = getAudioContext();
    await ctx.resume();
    const now = ctx.currentTime;

    // Short descending two-note confirm
    playTone(ctx, 523.25, now, 0.2, 0.25);
    playTone(ctx, 392.0, now + 0.15, 0.3, 0.2);
  } catch (err) {
    console.warn("Audio playback failed:", err);
  }
}
