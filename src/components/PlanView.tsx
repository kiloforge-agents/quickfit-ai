"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { adaptForRecovery, generatePlan } from "@/lib/planner";
import { readWearable } from "@/lib/wearable";
import type { DayPlan, PlanInputs, WearableSnapshot, WeeklyPlan } from "@/lib/types";

function decodeInputs(raw: string | null): PlanInputs | null {
  if (!raw) return null;
  try {
    const json = decodeURIComponent(escape(atob(decodeURIComponent(raw))));
    return JSON.parse(json) as PlanInputs;
  } catch {
    return null;
  }
}

const DEFAULT_INPUTS: PlanInputs = {
  name: "Athlete",
  goal: "general",
  experience: "casual",
  daysPerWeek: 4,
  minutesPerSession: 35,
  equipment: ["bodyweight", "dumbbells"],
  preferOutdoor: true,
  injuries: "",
};

export default function PlanView() {
  const sp = useSearchParams();
  const inputs = useMemo(() => decodeInputs(sp.get("d")) ?? DEFAULT_INPUTS, [sp]);

  const basePlan: WeeklyPlan = useMemo(() => generatePlan(inputs), [inputs]);

  const [seed, setSeed] = useState(0);
  const [wearable, setWearable] = useState<WearableSnapshot>(() => readWearable(0));
  const [recoveryOverride, setRecoveryOverride] = useState<number | null>(null);
  const [autoAdapt, setAutoAdapt] = useState(true);
  const [openDay, setOpenDay] = useState<number | null>(0);

  useEffect(() => {
    setWearable(readWearable(seed));
    const t = setInterval(() => {
      setWearable(() => readWearable(seed + Math.floor(Math.random() * 8)));
    }, 4000);
    return () => clearInterval(t);
  }, [seed]);

  const recovery = recoveryOverride ?? wearable.recovery;

  const plan: WeeklyPlan = useMemo(() => {
    if (!autoAdapt) return basePlan;
    return adaptForRecovery(basePlan, recovery);
  }, [basePlan, recovery, autoAdapt]);

  const totalMinutes = plan.days.reduce((s, d) => s + d.duration, 0);
  const trainingDays = plan.days.filter((d) => d.intent !== "rest").length;

  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8 py-10 print:py-4 print:max-w-none print:px-6">
      {/* Title block */}
      <section className="grid lg:grid-cols-12 gap-8 items-end pb-8 border-b border-stone-200">
        <div className="lg:col-span-7">
          <div className="flex items-center gap-2 mb-3 print:hidden">
            <span className="chip">
              <span className="text-orange-500">●</span> Plan ready
            </span>
            <span className="text-xs uppercase tracking-[0.18em] text-stone-500">
              Generated locally · {new Date(plan.generatedAt).toLocaleDateString()}
            </span>
          </div>
          <h1 className="display-serif text-4xl sm:text-5xl text-stone-900 leading-[1.05]">
            {plan.inputs.name}'s week
            <span className="text-stone-400"> · </span>
            <span className="text-stone-700">{labelForGoal(plan.inputs.goal)}</span>
          </h1>
          <p className="mt-3 text-stone-600 max-w-2xl text-[15px] leading-relaxed">
            {plan.weekFocus}
          </p>
        </div>
        <div className="lg:col-span-5 grid grid-cols-3 gap-3">
          <KPI label="Sessions" v={String(trainingDays)} />
          <KPI label="Total time" v={`${totalMinutes}m`} />
          <KPI label="Avg intensity" v={String(avgIntensity(plan))} suffix="/10" />
        </div>
      </section>

      {/* Wearable strip */}
      <section className="grid lg:grid-cols-12 gap-6 py-8 border-b border-stone-200 print:hidden">
        <div className="lg:col-span-7">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm uppercase tracking-[0.18em] text-stone-500">Wearable feed</h2>
            <span className="text-xs text-stone-400 numeral">Demo signal · refreshes 4s</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Metric label="HRV" value={`${wearable.hrv}`} unit="ms" trend={wearable.hrv > 60 ? "good" : wearable.hrv > 50 ? "ok" : "low"} />
            <Metric label="Resting HR" value={`${wearable.restingHr}`} unit="bpm" trend={wearable.restingHr < 60 ? "good" : wearable.restingHr < 65 ? "ok" : "low"} />
            <Metric label="Sleep" value={`${wearable.sleepHours}`} unit="hrs" trend={wearable.sleepHours >= 7.5 ? "good" : wearable.sleepHours >= 6.5 ? "ok" : "low"} />
            <Metric label="Steps" value={wearable.steps.toLocaleString()} unit="" trend={wearable.steps > 8000 ? "good" : wearable.steps > 4000 ? "ok" : "low"} />
          </div>
        </div>
        <div className="lg:col-span-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm uppercase tracking-[0.18em] text-stone-500">Recovery</h2>
            <button
              type="button"
              className="text-xs underline text-stone-500 hover:text-stone-900"
              onClick={() => setRecoveryOverride(null)}
            >
              {recoveryOverride !== null ? "Use wearable" : "Live"}
            </button>
          </div>
          <div className="card-soft p-5">
            <div className="flex items-baseline justify-between">
              <div className="display-serif text-5xl numeral text-stone-900">{recovery}</div>
              <span className="text-xs uppercase tracking-[0.18em] text-stone-500">
                {recovery >= 70 ? "Green · go" : recovery >= 50 ? "Amber · ease in" : recovery >= 35 ? "Amber · light" : "Red · recover"}
              </span>
            </div>
            <RecoveryBar value={recovery} />
            <input
              type="range"
              min={0}
              max={100}
              value={recovery}
              onChange={(e) => setRecoveryOverride(Number(e.target.value))}
              className="range w-full mt-4"
              aria-label="Override recovery"
            />
            <div className="flex items-center justify-between mt-3">
              <label className="flex items-center gap-2 text-sm text-stone-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoAdapt}
                  onChange={(e) => setAutoAdapt(e.target.checked)}
                  className="accent-stone-900"
                />
                Auto-adapt the plan
              </label>
              <span className="text-xs text-stone-500">
                {autoAdapt
                  ? recovery < 35
                    ? "Hard days swapped to mobility"
                    : recovery < 60
                    ? "Volume scaled to 85%"
                    : "No changes needed"
                  : "Manual mode"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Toolbar */}
      <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-6 print:hidden">
        <div className="flex items-center gap-2 text-sm text-stone-600">
          <span className="chip">
            {plan.inputs.experience} · {plan.inputs.daysPerWeek} days · {plan.inputs.minutesPerSession}m
          </span>
          {plan.inputs.equipment.slice(0, 3).map((e) => (
            <span key={e} className="chip">{e}</span>
          ))}
          {plan.inputs.equipment.length > 3 && (
            <span className="chip">+{plan.inputs.equipment.length - 3}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setSeed((s) => s + 1)} className="btn-ghost">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 1 1-3-6.7L21 8" />
              <path d="M21 3v5h-5" />
            </svg>
            Re-roll wearable
          </button>
          <button onClick={() => window.print()} className="btn-primary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9V2h12v7" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            Print / save PDF
          </button>
        </div>
      </section>

      {/* Week grid */}
      <section className="pb-12 print:pb-4">
        <div className="hidden print:block mb-4">
          <h2 className="display-serif text-2xl">Weekly plan · {plan.inputs.name}</h2>
          <div className="text-xs text-stone-500">
            {labelForGoal(plan.inputs.goal)} · {plan.inputs.daysPerWeek} days · {plan.inputs.minutesPerSession}m
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-7 gap-3 print:grid-cols-7 print:gap-2">
          {plan.days.map((d, i) => (
            <DayCard
              key={d.day + i}
              day={d}
              index={i}
              expanded={openDay === i}
              onToggle={() => setOpenDay(openDay === i ? null : i)}
            />
          ))}
        </div>
      </section>

      {/* Detailed day */}
      {openDay !== null && plan.days[openDay] && (
        <DetailedDay day={plan.days[openDay]} key={openDay + plan.days[openDay].title} />
      )}

      {/* Print-only full detail */}
      <section className="hidden print:block">
        {plan.days.map((d, i) => (
          <PrintDay key={i} day={d} />
        ))}
      </section>
    </div>
  );
}

function avgIntensity(p: WeeklyPlan) {
  const a = p.days.reduce((s, d) => s + d.intensity, 0) / p.days.length;
  return Math.round(a * 10) / 10;
}

function labelForGoal(g: string) {
  switch (g) {
    case "build-muscle":
      return "Build muscle";
    case "lose-fat":
      return "Lose fat";
    case "endurance":
      return "Endurance";
    case "mobility":
      return "Mobility";
    default:
      return "General fitness";
  }
}

function KPI({ label, v, suffix }: { label: string; v: string; suffix?: string }) {
  return (
    <div className="card-soft p-4">
      <div className="text-[11px] uppercase tracking-[0.18em] text-stone-500">{label}</div>
      <div className="display-serif text-3xl numeral text-stone-900 mt-1">
        {v}
        {suffix && <span className="text-stone-400 text-base ml-1">{suffix}</span>}
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  unit,
  trend,
}: {
  label: string;
  value: string;
  unit: string;
  trend: "good" | "ok" | "low";
}) {
  const dot =
    trend === "good" ? "bg-lime-600" : trend === "ok" ? "bg-amber-500" : "bg-rose-500";
  return (
    <div className="card-soft p-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] uppercase tracking-[0.18em] text-stone-500">{label}</span>
        <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      </div>
      <div className="numeral text-2xl font-semibold text-stone-900">
        {value}
        <span className="text-stone-400 text-sm font-normal ml-1">{unit}</span>
      </div>
    </div>
  );
}

function RecoveryBar({ value }: { value: number }) {
  return (
    <div className="mt-3 relative h-2 bg-stone-100 rounded-full overflow-hidden">
      <div
        className="h-full transition-[width] duration-500 ease-out rounded-full"
        style={{
          width: `${value}%`,
          background:
            value >= 70
              ? "#65a30d"
              : value >= 50
              ? "#f59e0b"
              : value >= 35
              ? "#f97316"
              : "#e11d48",
        }}
      />
    </div>
  );
}

function DayCard({
  day,
  index,
  expanded,
  onToggle,
}: {
  day: DayPlan;
  index: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  const tone = toneFor(day.intent);
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={expanded}
      className={`day-card text-left p-4 slide-in print:break-inside-avoid print:p-3 ${tone.bg} ${expanded ? "ring-2 ring-stone-900" : ""}`}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="flex items-center justify-between">
        <span className={`text-[11px] uppercase tracking-[0.2em] ${tone.muted}`}>{day.day}</span>
        <span className={`text-[10px] uppercase tracking-[0.18em] ${tone.tag}`}>{day.intent}</span>
      </div>
      <div className={`display-serif text-xl mt-2 leading-tight ${tone.fg}`}>{day.title}</div>
      <div className={`mt-3 flex items-center justify-between text-xs ${tone.muted}`}>
        <span className="numeral">{day.duration ? `${day.duration} min` : "—"}</span>
        <Pip n={day.intensity} muted={tone.muted} />
      </div>
    </button>
  );
}

function Pip({ n, muted }: { n: number; muted: string }) {
  return (
    <span className={`flex gap-[3px] ${muted}`} aria-label={`Intensity ${n}/10`}>
      {Array.from({ length: 10 }).map((_, i) => (
        <span
          key={i}
          className="w-[5px] h-2 rounded-[1px]"
          style={{
            background: i < n ? "currentColor" : "rgba(0,0,0,0.08)",
            opacity: i < n ? 0.85 : 1,
          }}
        />
      ))}
    </span>
  );
}

function toneFor(intent: DayPlan["intent"]) {
  switch (intent) {
    case "strength":
      return { bg: "bg-stone-900 text-stone-50", fg: "text-stone-50", muted: "text-stone-400", tag: "text-orange-300" };
    case "hiit":
      return { bg: "bg-orange-500 text-white border-orange-500", fg: "text-white", muted: "text-orange-50/80", tag: "text-orange-50/90" };
    case "cardio":
      return { bg: "bg-white", fg: "text-stone-900", muted: "text-stone-500", tag: "text-orange-600" };
    case "mobility":
      return { bg: "bg-lime-50 border-lime-200", fg: "text-stone-900", muted: "text-stone-500", tag: "text-lime-700" };
    case "active":
      return { bg: "bg-amber-50 border-amber-200", fg: "text-stone-900", muted: "text-stone-500", tag: "text-amber-700" };
    default:
      return { bg: "bg-stone-100 text-stone-500", fg: "text-stone-500", muted: "text-stone-400", tag: "text-stone-400" };
  }
}

function DetailedDay({ day }: { day: DayPlan }) {
  return (
    <section className="card-soft p-6 sm:p-8 mt-4 print:hidden rise">
      <div className="flex items-baseline justify-between flex-wrap gap-2">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-stone-500">{day.day} · {day.intent}</div>
          <h3 className="display-serif text-3xl text-stone-900 mt-1">{day.title}</h3>
        </div>
        <div className="text-sm text-stone-500 numeral">
          {day.duration ? `${day.duration} min` : "Rest"} · intensity {day.intensity}/10
        </div>
      </div>
      <div className="rule-h my-5" />
      <div className="grid md:grid-cols-2 gap-x-10 gap-y-6">
        {day.blocks.map((b) => (
          <div key={b.label}>
            <h4 className="text-xs uppercase tracking-[0.18em] text-orange-600 mb-3">{b.label}</h4>
            <ul className="space-y-2.5">
              {b.items.map((it, i) => (
                <li key={i} className="flex items-baseline gap-3 border-b border-dashed border-stone-200 pb-2">
                  <span className="numeral text-stone-400 text-xs w-5 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                  <div className="flex-1">
                    <div className="text-stone-900 font-medium">{it.name}</div>
                    {it.detail && <div className="text-sm text-stone-500">{it.detail}</div>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {day.notes && (
        <>
          <div className="rule-h my-5" />
          <div className="flex items-start gap-3 text-sm text-stone-700">
            <span className="text-orange-600">¶</span>
            <span>{day.notes}</span>
          </div>
        </>
      )}
    </section>
  );
}

function PrintDay({ day }: { day: DayPlan }) {
  return (
    <div className="break-inside-avoid mb-4 mt-4">
      <div className="border-b border-stone-300 pb-1 mb-2 flex justify-between text-xs">
        <span className="font-bold uppercase">{day.day} · {day.title}</span>
        <span>{day.duration ? `${day.duration}m` : "rest"} · intensity {day.intensity}/10</span>
      </div>
      <div className="grid grid-cols-2 gap-4 text-[11px]">
        {day.blocks.map((b) => (
          <div key={b.label}>
            <div className="font-semibold text-orange-700 uppercase">{b.label}</div>
            <ul>
              {b.items.map((it, i) => (
                <li key={i}>
                  • {it.name}
                  {it.detail ? ` — ${it.detail}` : ""}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {day.notes && <div className="text-[11px] mt-1 italic">Note: {day.notes}</div>}
    </div>
  );
}
