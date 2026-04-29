export type Goal = "lose-fat" | "build-muscle" | "endurance" | "general" | "mobility";
export type Experience = "new" | "casual" | "consistent" | "athlete";
export type Equipment =
  | "bodyweight"
  | "dumbbells"
  | "kettlebell"
  | "bands"
  | "pullup"
  | "bench"
  | "barbell"
  | "cardio"
  | "yoga";

export type Intent = "rest" | "strength" | "cardio" | "hiit" | "mobility" | "active";

export interface PlanInputs {
  name: string;
  goal: Goal;
  experience: Experience;
  daysPerWeek: number;
  minutesPerSession: number;
  equipment: Equipment[];
  preferOutdoor: boolean;
  injuries: string;
}

export interface Exercise {
  name: string;
  detail: string;
  tag: "primary" | "accessory" | "core" | "warmup" | "cooldown" | "cardio";
}

export interface DayPlan {
  day: string;
  intent: Intent;
  title: string;
  duration: number;
  intensity: number; // 1-10
  blocks: {
    label: string;
    items: Exercise[];
  }[];
  notes: string;
}

export interface WeeklyPlan {
  inputs: PlanInputs;
  generatedAt: string;
  weekFocus: string;
  weeklyVolume: number;
  days: DayPlan[];
}

export interface WearableSnapshot {
  hrv: number; // ms
  restingHr: number;
  sleepHours: number;
  recovery: number; // 0-100
  steps: number;
}
