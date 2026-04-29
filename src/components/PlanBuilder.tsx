"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Equipment, Experience, Goal, PlanInputs } from "@/lib/types";

const GOALS: { id: Goal; label: string; sub: string }[] = [
  { id: "lose-fat", label: "Lose fat", sub: "Burn cals, keep muscle" },
  { id: "build-muscle", label: "Build muscle", sub: "Hypertrophy + recovery" },
  { id: "endurance", label: "Endurance", sub: "5K to 10K, conditioning" },
  { id: "general", label: "General fitness", sub: "Mixed, balanced week" },
  { id: "mobility", label: "Mobility", sub: "Range of motion, low load" },
];

const EXP: { id: Experience; label: string; sub: string }[] = [
  { id: "new", label: "Brand new", sub: "Last 2 months: little to none" },
  { id: "casual", label: "Casual", sub: "1–2 sessions / week" },
  { id: "consistent", label: "Consistent", sub: "3+ sessions for 6+ months" },
  { id: "athlete", label: "Athletic", sub: "Trained or competing" },
];

const EQUIPMENT: { id: Equipment; label: string; icon: string }[] = [
  { id: "bodyweight", label: "Bodyweight only", icon: "👤" },
  { id: "dumbbells", label: "Dumbbells", icon: "🏋️" },
  { id: "kettlebell", label: "Kettlebell", icon: "🔔" },
  { id: "bands", label: "Resistance bands", icon: "➿" },
  { id: "pullup", label: "Pull-up bar", icon: "─" },
  { id: "bench", label: "Bench", icon: "🪑" },
  { id: "barbell", label: "Barbell + plates", icon: "═" },
  { id: "cardio", label: "Cardio machine", icon: "🚴" },
  { id: "yoga", label: "Yoga mat", icon: "🧘" },
];

function encodeInputs(p: PlanInputs): string {
  const obj = { ...p };
  return encodeURIComponent(btoa(unescape(encodeURIComponent(JSON.stringify(obj)))));
}

export default function PlanBuilder() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [goal, setGoal] = useState<Goal>("general");
  const [experience, setExperience] = useState<Experience>("casual");
  const [days, setDays] = useState(4);
  const [minutes, setMinutes] = useState(35);
  const [equip, setEquip] = useState<Equipment[]>(["bodyweight", "dumbbells"]);
  const [outdoor, setOutdoor] = useState(true);
  const [injuries, setInjuries] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const valid = useMemo(() => equip.length > 0 && days >= 1 && minutes >= 10, [equip, days, minutes]);

  const toggleEq = (id: Equipment) =>
    setEquip((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));

  const onGenerate = () => {
    if (!valid) return;
    setSubmitting(true);
    const payload: PlanInputs = {
      name: name.trim() || "Athlete",
      goal,
      experience,
      daysPerWeek: days,
      minutesPerSession: minutes,
      equipment: equip,
      preferOutdoor: outdoor,
      injuries: injuries.trim(),
    };
    router.push(`/plan?d=${encodeInputs(payload)}`);
  };

  return (
    <div className="grid lg:grid-cols-12 gap-6">
      <div className="lg:col-span-8 space-y-6">
        {/* Step 1: Goal */}
        <Section index="01" title="What are you training for?">
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
            {GOALS.map((g) => (
              <button
                key={g.id}
                type="button"
                className="tog flex-col items-start py-3"
                data-active={goal === g.id}
                onClick={() => setGoal(g.id)}
              >
                <span className="font-semibold">{g.label}</span>
                <span className="text-[12px] opacity-70">{g.sub}</span>
              </button>
            ))}
          </div>
        </Section>

        {/* Step 2: Experience */}
        <Section index="02" title="Where are you starting?">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {EXP.map((e) => (
              <button
                key={e.id}
                type="button"
                className="tog flex-col items-start py-3"
                data-active={experience === e.id}
                onClick={() => setExperience(e.id)}
              >
                <span className="font-semibold">{e.label}</span>
                <span className="text-[12px] opacity-70">{e.sub}</span>
              </button>
            ))}
          </div>
        </Section>

        {/* Step 3: Time */}
        <Section index="03" title="How much time can you actually give?">
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-stone-600 flex items-center justify-between mb-2">
                Days per week <span className="numeral text-stone-900 font-semibold">{days}</span>
              </label>
              <input
                aria-label="Days per week"
                type="range"
                min={1}
                max={7}
                step={1}
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="range w-full"
              />
              <div className="grid grid-cols-7 text-[11px] text-stone-400 mt-1">
                {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                  <span key={n} className={`text-center ${n === days ? "text-stone-900 font-semibold" : ""}`}>
                    {n}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm text-stone-600 flex items-center justify-between mb-2">
                Minutes per session <span className="numeral text-stone-900 font-semibold">{minutes}</span>
              </label>
              <input
                aria-label="Minutes per session"
                type="range"
                min={10}
                max={90}
                step={5}
                value={minutes}
                onChange={(e) => setMinutes(Number(e.target.value))}
                className="range w-full"
              />
              <div className="grid grid-cols-5 text-[11px] text-stone-400 mt-1">
                {[10, 30, 50, 70, 90].map((n) => (
                  <span key={n} className="text-center">{n}m</span>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* Step 4: Equipment */}
        <Section index="04" title="What's in your space?">
          <p className="text-stone-500 text-sm mb-3">Pick all that apply. We'll pick the best mix.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {EQUIPMENT.map((eq) => (
              <button
                key={eq.id}
                type="button"
                className="tog"
                data-active={equip.includes(eq.id)}
                onClick={() => toggleEq(eq.id)}
              >
                <span className="tog-check">
                  {equip.includes(eq.id) && (
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6.5l2.5 2.5L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <span className="flex-1">{eq.label}</span>
                <span className="text-base" aria-hidden>{eq.icon}</span>
              </button>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setOutdoor((o) => !o)}
              className="tog max-w-xs"
              data-active={outdoor}
            >
              <span className="tog-check">
                {outdoor && (
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6.5l2.5 2.5L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              I prefer outdoor cardio when possible
            </button>
          </div>
        </Section>

        {/* Step 5: Injuries */}
        <Section index="05" title="Anything we should work around?">
          <div className="space-y-2">
            <input
              type="text"
              placeholder='e.g. "Left knee, lower back"'
              value={injuries}
              onChange={(e) => setInjuries(e.target.value)}
              className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:border-stone-900"
              aria-label="Injuries"
            />
            <input
              type="text"
              placeholder="Your name (optional, just for the printout)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:border-stone-900"
              aria-label="Name"
            />
          </div>
        </Section>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onGenerate}
            disabled={!valid || submitting}
            className="btn-primary px-6 py-3.5 text-base"
          >
            {submitting ? "Building your week…" : "Generate my plan"}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </button>
          <p className="text-xs text-stone-500">
            Plan is generated on-device. Nothing is sent to a server.
          </p>
        </div>
      </div>

      {/* Live summary */}
      <aside className="lg:col-span-4">
        <div className="lg:sticky lg:top-20 card-soft p-6">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-stone-500">
            <span>Plan summary</span>
            <span className="numeral">{equip.length} item{equip.length === 1 ? "" : "s"}</span>
          </div>
          <h3 className="display-serif text-2xl mt-2 text-stone-900 leading-tight">
            {GOALS.find((g) => g.id === goal)?.label}
            <span className="text-stone-400"> · </span>
            <span className="numeral">{days}</span>
            <span className="text-stone-400"> × </span>
            <span className="numeral">{minutes}m</span>
          </h3>
          <p className="text-stone-600 mt-2 text-sm leading-relaxed">
            {EXP.find((x) => x.id === experience)?.label} · roughly{" "}
            <span className="font-semibold text-stone-900 numeral">{days * minutes}</span> min/week
          </p>
          <div className="rule-h my-5" />
          <div className="flex flex-wrap gap-1.5">
            {equip.length === 0 ? (
              <span className="text-stone-400 text-sm">Pick at least one equipment option</span>
            ) : (
              equip.map((e) => (
                <span key={e} className="chip text-xs">{EQUIPMENT.find((x) => x.id === e)?.label}</span>
              ))
            )}
          </div>
          {injuries && (
            <>
              <div className="rule-h my-5" />
              <div className="text-xs uppercase tracking-[0.18em] text-stone-500 mb-1">Avoid</div>
              <div className="text-sm text-stone-700">{injuries}</div>
            </>
          )}
          <div className="rule-h my-5" />
          <div className="flex items-center justify-between text-sm">
            <span className="text-stone-500">Volume</span>
            <span className="font-semibold numeral">
              {days * minutes >= 240 ? "High" : days * minutes >= 120 ? "Moderate" : "Low"}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1.5">
            <span className="text-stone-500">Outdoor cardio</span>
            <span className="font-semibold">{outdoor ? "Yes" : "No"}</span>
          </div>
        </div>
      </aside>
    </div>
  );
}

function Section({
  index,
  title,
  children,
}: {
  index: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="card-soft p-5 sm:p-6">
      <header className="flex items-baseline gap-3 mb-4">
        <span className="text-xs uppercase tracking-[0.2em] text-orange-600 numeral">{index}</span>
        <h3 className="text-[17px] sm:text-[18px] font-semibold tracking-tight text-stone-900">
          {title}
        </h3>
      </header>
      {children}
    </section>
  );
}
