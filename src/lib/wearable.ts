import type { WearableSnapshot } from "./types";

// Deterministic but varying mock — uses minute-of-day so user sees movement
// without the noise of true randomness.
export function readWearable(seed = 0): WearableSnapshot {
  const now = new Date();
  const t = now.getHours() * 60 + now.getMinutes() + seed;
  const wave = (period: number, offset = 0) =>
    (Math.sin(((t + offset) / period) * Math.PI * 2) + 1) / 2;

  const hrv = Math.round(48 + wave(180) * 32); // 48–80 ms
  const restingHr = Math.round(54 + wave(120, 30) * 14);
  const sleepHours = Math.round((6.6 + wave(360, 60) * 1.8) * 10) / 10;
  const steps = Math.round(2400 + wave(60) * 6800);
  const recovery = Math.round(
    Math.max(
      0,
      Math.min(
        100,
        ((hrv - 40) / 50) * 35 + ((sleepHours - 5) / 4) * 35 + (1 - (restingHr - 50) / 30) * 30
      )
    )
  );

  return { hrv, restingHr, sleepHours, recovery, steps };
}
