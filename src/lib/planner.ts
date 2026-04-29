import type {
  DayPlan,
  Equipment,
  Exercise,
  Experience,
  Goal,
  Intent,
  PlanInputs,
  WeeklyPlan,
} from "./types";

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Pools
const STRENGTH_PRIMARY: Record<Equipment, string[]> = {
  bodyweight: ["Push-ups", "Bulgarian Split Squats", "Pike Push-ups", "Glute Bridges"],
  dumbbells: ["Goblet Squat", "DB Bench Press", "DB Romanian Deadlift", "DB Row"],
  kettlebell: ["KB Swing", "KB Goblet Squat", "KB Clean & Press", "KB Front Rack Carry"],
  bands: ["Banded Squat", "Banded Pull-Apart", "Banded Hip Hinge", "Banded Press"],
  pullup: ["Pull-ups", "Chin-ups", "Dead Hangs", "Inverted Rows"],
  bench: ["Bench Press", "Incline Press", "Step-Ups", "Bench Dips"],
  barbell: ["Back Squat", "Deadlift", "Overhead Press", "Bent-Over Row"],
  cardio: ["Tempo Row", "Bike Intervals", "Treadmill Hill Walk", "Erg Pulls"],
  yoga: ["Sun Salutations", "Warrior Flow", "Hip Opener Flow", "Spinal Mobility Flow"],
};

const ACCESSORIES = [
  "Side Plank Reach",
  "Single-Leg RDL",
  "Hollow Body Hold",
  "Reverse Lunge",
  "Tricep Extension",
  "Hammer Curl",
  "Face Pulls",
  "Calf Raises",
  "Pallof Press",
];

const CARDIO = [
  "Easy Zone-2 Run",
  "Tempo Run",
  "Bike Sprints (30s on / 30s off)",
  "Brisk Walk",
  "Stair Intervals",
  "Jump Rope Pyramid",
  "Row Erg 4×500m",
];

const HIIT_BLOCKS = [
  "EMOM 12: 8 KB Swings + 6 Push-ups",
  "AMRAP 15: 10 Air Squats / 8 Push-ups / 6 Burpees",
  "5 rounds: 200m Row + 12 Goblet Squats",
  "Tabata Mix: Squats / Mountain Climbers / Plank Jacks",
  "30/30 ladder: Run, Skater, Row, Step-up — 6 rounds",
];

const MOBILITY = [
  "World's Greatest Stretch",
  "90/90 Hip Switches",
  "Cat-Cow Flow",
  "Thoracic Openers",
  "Couch Stretch",
  "Banded Shoulder Pass-Throughs",
];

const CORE = [
  "Hollow Hold 3×30s",
  "Dead Bug 3×10/side",
  "Side Plank 3×30s/side",
  "Bird Dog 3×8/side",
];

const WARMUP_GENERAL: Exercise[] = [
  { name: "Easy cardio", detail: "5 min — bike, jog, or jump rope", tag: "warmup" },
  { name: "Dynamic flow", detail: "Leg swings, T-spine, hip openers — 3 min", tag: "warmup" },
];

const COOLDOWN_GENERAL: Exercise[] = [
  { name: "Slow walk + breathwork", detail: "3 min, exhale longer than inhale", tag: "cooldown" },
  { name: "Static stretch", detail: "Hold each 30s — hips, hamstrings, chest", tag: "cooldown" },
];

function pick<T>(arr: T[], n: number, seed: number): T[] {
  const out: T[] = [];
  const used = new Set<number>();
  let i = 0;
  while (out.length < Math.min(n, arr.length)) {
    const idx = (seed + i * 7 + i * i) % arr.length;
    if (!used.has(idx)) {
      used.add(idx);
      out.push(arr[idx]);
    }
    i++;
    if (i > arr.length * 4) break;
  }
  return out;
}

function repsForExperience(exp: Experience): { sets: number; reps: string } {
  switch (exp) {
    case "new":
      return { sets: 3, reps: "8–10" };
    case "casual":
      return { sets: 3, reps: "8–12" };
    case "consistent":
      return { sets: 4, reps: "6–10" };
    case "athlete":
      return { sets: 5, reps: "5–8" };
  }
}

function intensityFor(intent: Intent, exp: Experience): number {
  const base: Record<Intent, number> = {
    rest: 1,
    mobility: 3,
    active: 4,
    cardio: 6,
    strength: 7,
    hiit: 9,
  };
  const bump: Record<Experience, number> = { new: -1, casual: 0, consistent: 1, athlete: 2 };
  return Math.max(1, Math.min(10, base[intent] + bump[exp]));
}

function chooseEquipmentSubset(eq: Equipment[]): Equipment[] {
  if (eq.length === 0) return ["bodyweight"];
  return eq;
}

function dayTitle(intent: Intent, idx: number): string {
  const map: Record<Intent, string[]> = {
    strength: ["Push & Core", "Pull & Posture", "Lower Body Power", "Full-Body Strength"],
    cardio: ["Zone-2 Engine", "Tempo Builder", "Long Easy Effort"],
    hiit: ["Conditioning Spike", "Metabolic Mix", "Sprint Ladder"],
    mobility: ["Hips & Spine Flow", "Recovery Mobility"],
    active: ["Active Recovery Walk", "Easy Movement"],
    rest: ["Full Rest"],
  };
  const opts = map[intent];
  return opts[idx % opts.length];
}

function buildSchedule(goal: Goal, days: number, exp: Experience): Intent[] {
  const week: Intent[] = Array(7).fill("rest");
  const trainingDays: Intent[] = [];

  if (goal === "build-muscle") {
    for (let i = 0; i < days; i++) trainingDays.push(i % 4 === 3 ? "cardio" : "strength");
  } else if (goal === "lose-fat") {
    const pattern: Intent[] = ["strength", "hiit", "strength", "cardio", "hiit", "strength", "active"];
    for (let i = 0; i < days; i++) trainingDays.push(pattern[i % pattern.length]);
  } else if (goal === "endurance") {
    const pattern: Intent[] = ["cardio", "strength", "cardio", "cardio", "hiit", "cardio", "active"];
    for (let i = 0; i < days; i++) trainingDays.push(pattern[i % pattern.length]);
  } else if (goal === "mobility") {
    const pattern: Intent[] = ["mobility", "strength", "mobility", "active", "strength", "mobility", "active"];
    for (let i = 0; i < days; i++) trainingDays.push(pattern[i % pattern.length]);
  } else {
    const pattern: Intent[] = ["strength", "cardio", "strength", "mobility", "strength", "cardio", "active"];
    for (let i = 0; i < days; i++) trainingDays.push(pattern[i % pattern.length]);
  }

  // Spread across the week intelligently
  const slots = (() => {
    if (days === 7) return [0, 1, 2, 3, 4, 5, 6];
    if (days === 6) return [0, 1, 2, 3, 4, 5];
    if (days === 5) return [0, 1, 2, 4, 5];
    if (days === 4) return [0, 1, 3, 5];
    if (days === 3) return [0, 2, 4];
    if (days === 2) return [0, 3];
    return [0];
  })();

  slots.forEach((slot, i) => {
    week[slot] = trainingDays[i] ?? "active";
  });

  // Reduce volume for new lifters: turn the last hard day into mobility
  if (exp === "new" && days >= 4) {
    const lastIdx = [...week].map((v, i) => (v === "hiit" ? i : -1)).filter((i) => i >= 0).pop();
    if (lastIdx !== undefined) week[lastIdx] = "active";
  }
  return week;
}

function buildDay(
  intent: Intent,
  inputs: PlanInputs,
  i: number
): DayPlan {
  const eq = chooseEquipmentSubset(inputs.equipment);
  const seed = (i + 1) * 13 + inputs.minutesPerSession;
  const { sets, reps } = repsForExperience(inputs.experience);
  const day = DAY_NAMES[i];
  const intensity = intensityFor(intent, inputs.experience);

  if (intent === "rest") {
    return {
      day,
      intent,
      title: "Rest",
      duration: 0,
      intensity: 1,
      blocks: [
        {
          label: "Recovery focus",
          items: [
            { name: "Sleep target", detail: "Aim 7–9 hrs", tag: "cooldown" },
            { name: "Light walking", detail: "Optional 10–20 min easy walk", tag: "cooldown" },
            { name: "Hydrate", detail: "Body weight (lbs) ÷ 2 = oz target", tag: "cooldown" },
          ],
        },
      ],
      notes: "Take it easy — adaptation happens off the floor.",
    };
  }

  if (intent === "mobility") {
    const items = pick(MOBILITY, 5, seed).map(
      (m) => ({ name: m, detail: "60–90 sec", tag: "warmup" } as Exercise)
    );
    return {
      day,
      intent,
      title: dayTitle("mobility", i),
      duration: Math.min(45, inputs.minutesPerSession),
      intensity,
      blocks: [
        { label: "Flow", items },
        {
          label: "Breath finisher",
          items: [{ name: "Box breathing", detail: "4-4-4-4 × 5 min", tag: "cooldown" }],
        },
      ],
      notes: "Move slow. Match breath to movement.",
    };
  }

  if (intent === "active") {
    return {
      day,
      intent,
      title: dayTitle("active", i),
      duration: 30,
      intensity,
      blocks: [
        {
          label: "Easy movement",
          items: [
            { name: inputs.preferOutdoor ? "Outdoor walk" : "Treadmill walk", detail: "25–35 min, conversational pace", tag: "cardio" },
            { name: "Joint circles", detail: "Ankles, hips, shoulders — 2 min total", tag: "warmup" },
          ],
        },
      ],
      notes: "Keep heart rate below 65% max. This counts.",
    };
  }

  if (intent === "cardio") {
    const sessions = pick(CARDIO, 2, seed);
    return {
      day,
      intent,
      title: dayTitle("cardio", i),
      duration: inputs.minutesPerSession,
      intensity,
      blocks: [
        { label: "Warm-up", items: WARMUP_GENERAL },
        {
          label: "Main set",
          items: sessions.map<Exercise>((s) => ({
            name: s,
            detail: `${Math.max(15, inputs.minutesPerSession - 15)} min total`,
            tag: "cardio",
          })),
        },
        { label: "Cool-down", items: COOLDOWN_GENERAL },
      ],
      notes: inputs.preferOutdoor
        ? "Take it outside if weather allows — fresh air, real terrain."
        : "Indoor is fine. Pick a machine you'll actually use.",
    };
  }

  if (intent === "hiit") {
    const block = HIIT_BLOCKS[seed % HIIT_BLOCKS.length];
    return {
      day,
      intent,
      title: dayTitle("hiit", i),
      duration: Math.min(40, inputs.minutesPerSession),
      intensity,
      blocks: [
        { label: "Warm-up", items: WARMUP_GENERAL },
        {
          label: "Conditioning",
          items: [{ name: block, detail: "Push hard, rest as needed", tag: "cardio" }],
        },
        {
          label: "Core finisher",
          items: pick(CORE, 2, seed).map((c) => ({ name: c, detail: "", tag: "core" } as Exercise)),
        },
        { label: "Cool-down", items: COOLDOWN_GENERAL },
      ],
      notes: "Quality > quantity. Stop if form breaks.",
    };
  }

  // Strength
  const equipChoice = eq[seed % eq.length];
  const primaryPool = STRENGTH_PRIMARY[equipChoice];
  const primaries = pick(primaryPool, 2, seed);
  const accessories = pick(ACCESSORIES, 3, seed + 5);
  const core = pick(CORE, 2, seed + 11);

  return {
    day,
    intent,
    title: dayTitle("strength", i),
    duration: inputs.minutesPerSession,
    intensity,
    blocks: [
      { label: "Warm-up", items: WARMUP_GENERAL },
      {
        label: "Primary lifts",
        items: primaries.map<Exercise>((p) => ({
          name: p,
          detail: `${sets} × ${reps} • RPE 7–8`,
          tag: "primary",
        })),
      },
      {
        label: "Accessories",
        items: accessories.map<Exercise>((a) => ({
          name: a,
          detail: `3 × 10–12`,
          tag: "accessory",
        })),
      },
      {
        label: "Core",
        items: core.map<Exercise>((c) => ({ name: c, detail: "", tag: "core" })),
      },
      { label: "Cool-down", items: COOLDOWN_GENERAL },
    ],
    notes: inputs.injuries
      ? `Mind your ${inputs.injuries.toLowerCase()} — sub anything that aggravates it.`
      : "Leave 1–2 reps in reserve on every set.",
  };
}

export function generatePlan(inputs: PlanInputs): WeeklyPlan {
  const schedule = buildSchedule(inputs.goal, inputs.daysPerWeek, inputs.experience);
  const days: DayPlan[] = schedule.map((intent, i) => buildDay(intent, inputs, i));
  const weeklyVolume = days.reduce((acc, d) => acc + d.duration, 0);
  const weekFocus = (() => {
    switch (inputs.goal) {
      case "build-muscle":
        return "Hypertrophy block — push primary lifts, eat to recover.";
      case "lose-fat":
        return "Calorie burn + lean muscle protection. Move daily.";
      case "endurance":
        return "Aerobic base building with 1 quality session.";
      case "mobility":
        return "Tissue prep, range of motion, low joint load.";
      default:
        return "Balanced strength, conditioning, and recovery.";
    }
  })();

  return {
    inputs,
    generatedAt: new Date().toISOString(),
    weekFocus,
    weeklyVolume,
    days,
  };
}

export function adaptForRecovery(plan: WeeklyPlan, recovery: number): WeeklyPlan {
  // Mutate intensity & swap hard days when recovery is low
  const factor = recovery < 35 ? 0.6 : recovery < 60 ? 0.85 : 1;
  const days = plan.days.map((d) => {
    if (d.intent === "rest" || d.intent === "active" || d.intent === "mobility") return d;
    if (recovery < 35 && (d.intent === "hiit" || d.intent === "strength")) {
      return {
        ...d,
        intent: "mobility" as Intent,
        title: "Recovery Flow (auto-swap)",
        duration: 30,
        intensity: 3,
        blocks: [
          {
            label: "Recovery flow",
            items: MOBILITY.slice(0, 5).map((m) => ({
              name: m,
              detail: "60–90 sec",
              tag: "warmup" as const,
            })),
          },
        ],
        notes: "Recovery low — switched to mobility. Resume tomorrow.",
      };
    }
    return {
      ...d,
      duration: Math.round(d.duration * factor),
      intensity: Math.max(1, Math.round(d.intensity * factor)),
    };
  });
  return { ...plan, days };
}
