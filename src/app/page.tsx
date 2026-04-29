import Link from "next/link";
import PlanBuilder from "@/components/PlanBuilder";
import LiveBadge from "@/components/LiveBadge";
import { Logo } from "@/components/Logo";

export default function Home() {
  return (
    <main className="flex-1">
      {/* Top bar */}
      <header className="border-b border-stone-200 bg-stone-50/80 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 text-stone-900">
            <Logo />
            <span className="font-semibold tracking-tight">QuickFitAI</span>
            <span className="hidden sm:inline-block text-[11px] uppercase tracking-[0.18em] text-stone-500 ml-1">
              · Coach
            </span>
          </Link>
          <nav className="flex items-center gap-1 sm:gap-2 text-sm">
            <Link href="#how" className="hidden md:inline px-3 py-1.5 text-stone-600 hover:text-stone-900">
              How it works
            </Link>
            <Link href="#why" className="hidden md:inline px-3 py-1.5 text-stone-600 hover:text-stone-900">
              Why free
            </Link>
            <Link href="#sample" className="hidden md:inline px-3 py-1.5 text-stone-600 hover:text-stone-900">
              Sample plan
            </Link>
            <a
              href="#builder"
              className="px-3 py-1.5 rounded-md bg-stone-900 text-stone-50 hover:bg-stone-800"
            >
              Build my week
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-lines opacity-60 pointer-events-none" />
        <div className="absolute inset-0 paper-grain pointer-events-none" />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-8 pt-14 pb-16 sm:pt-20 sm:pb-24">
          <div className="grid lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-7 rise">
              <div className="flex items-center gap-2 mb-6">
                <LiveBadge />
                <span className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  No subscription · No login · Works offline
                </span>
              </div>
              <h1 className="display-serif text-[44px] leading-[1.05] sm:text-6xl lg:text-7xl text-stone-900">
                A weekly workout that <span className="underline-mark">fits your life</span>,
                <br className="hidden sm:block" />
                rewritten when your body says so.
              </h1>
              <p className="mt-6 max-w-xl text-stone-600 text-lg leading-relaxed">
                Tell QuickFitAI your goal, your gear, and how much time you really
                have. We&apos;ll print a 7-day plan you can follow today — and adjust it
                in real time when your wearable says recovery is low.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#builder" className="btn-primary">
                  Generate my week
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </a>
                <a href="#sample" className="btn-ghost">
                  Peek at a sample
                </a>
              </div>

              <dl className="mt-10 grid grid-cols-3 max-w-md gap-x-2 sm:gap-x-6">
                <Stat n="9" label="goal × gear combos" />
                <Stat n="60s" label="from inputs to plan" />
                <Stat n="$0" label="forever, no upsell" />
              </dl>
            </div>

            {/* Visual: paper plan card */}
            <div className="lg:col-span-5 rise" style={{ animationDelay: "0.12s" }}>
              <PreviewCard />
            </div>
          </div>
        </div>

        {/* Ticker */}
        <div className="border-y border-stone-200 bg-stone-100/60 overflow-hidden">
          <div className="marquee-track flex gap-12 py-3 whitespace-nowrap text-stone-500 text-sm tracking-wide">
            {Array.from({ length: 2 }).map((_, group) => (
              <div key={group} className="flex gap-12 shrink-0">
                {[
                  "5 days · 30 min · dumbbells",
                  "Build muscle · home gym",
                  "Train for a 10K · 4 days",
                  "Beginner · zero equipment",
                  "Lose fat · 45 min · 5 days",
                  "Mobility focus · daily",
                  "HIIT · kettlebell · 25 min",
                  "Endurance · barbell + run",
                ].map((s, i) => (
                  <span key={`${group}-${i}`} className="flex items-center gap-3">
                    <span className="text-orange-600">●</span>
                    {s}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="mx-auto max-w-6xl px-5 sm:px-8 py-20">
        <div className="flex items-baseline justify-between flex-wrap gap-3 mb-10">
          <h2 className="display-serif text-3xl sm:text-4xl text-stone-900">How it works</h2>
          <span className="text-sm text-stone-500 numeral">01 — 03</span>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              n: "01",
              title: "Tell us the constraints",
              text:
                "Goal, weekly time budget, equipment on hand, injury notes. Nothing fluffy — only the inputs that actually move the plan.",
            },
            {
              n: "02",
              title: "Get a printable week",
              text:
                "A 7-day grid with sets, reps, and rest. Strength, conditioning, mobility, and active recovery, balanced for your level.",
            },
            {
              n: "03",
              title: "Wearable adjusts it",
              text:
                "Connect a watch (or use our demo signal). When HRV drops or sleep tanks, hard days flip to recovery automatically.",
            },
          ].map((b) => (
            <div key={b.n} className="card-soft p-6 relative">
              <span className="absolute -top-3 left-5 chip numeral">{b.n}</span>
              <h3 className="mt-4 text-lg font-semibold text-stone-900 tracking-tight">
                {b.title}
              </h3>
              <p className="mt-2 text-stone-600 leading-relaxed text-[15px]">{b.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SAMPLE PLAN */}
      <section id="sample" className="bg-stone-100 border-y border-stone-200">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-20">
          <div className="flex items-baseline justify-between flex-wrap gap-3 mb-10">
            <h2 className="display-serif text-3xl sm:text-4xl text-stone-900">
              A sample week, on paper
            </h2>
            <span className="text-sm text-stone-500">For: <em>Lose fat · 5 days · 35 min · dumbbells + bodyweight</em></span>
          </div>
          <SampleWeek />
        </div>
      </section>

      {/* BUILDER */}
      <section id="builder" className="mx-auto max-w-6xl px-5 sm:px-8 py-20">
        <div className="flex items-baseline justify-between flex-wrap gap-3 mb-2">
          <h2 className="display-serif text-3xl sm:text-4xl text-stone-900">
            Build <em>your</em> week
          </h2>
          <span className="text-sm text-stone-500 numeral">Step 1 of 1 — yes, just one</span>
        </div>
        <p className="text-stone-600 max-w-2xl mb-10">
          Answer five quick prompts. We&apos;ll print your plan instantly, no email
          gate. You can re-roll, save it as PDF, or open it on your phone.
        </p>
        <PlanBuilder />
      </section>

      {/* WHY FREE */}
      <section id="why" className="bg-stone-900 text-stone-50">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-20 grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
            <h2 className="display-serif text-3xl sm:text-4xl">
              Why this is <span className="underline-mark text-stone-50">free</span>.
            </h2>
            <p className="mt-4 text-stone-300 leading-relaxed">
              Most fitness apps lock a basic weekly template behind a $14.99
              subscription. That&apos;s silly. The plan you need to <em>start</em>
              shouldn&apos;t cost more than a gym visit.
            </p>
          </div>
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
            {[
              ["No account", "Generate, print, leave. We don't store your inputs."],
              ["No upsell", "There's no premium tier. There's just the planner."],
              ["No fluff", "Every screen earns its place. Five inputs, one plan."],
              ["Open logic", "The planner runs on-device. View source on GitHub."],
            ].map(([t, d]) => (
              <div key={t} className="border border-stone-700 rounded-xl p-5 bg-stone-900/40">
                <div className="text-orange-400 text-xs uppercase tracking-[0.2em] mb-2">
                  · {t}
                </div>
                <p className="text-stone-300 text-[15px] leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-5 sm:px-8 py-20">
        <h2 className="display-serif text-3xl sm:text-4xl text-stone-900 mb-8">
          Frequently asked
        </h2>
        <div className="divide-y divide-stone-200 border-t border-b border-stone-200">
          {[
            [
              "Does it really connect to my watch?",
              "We support a manual recovery slider out of the box. The wearable feed in the demo is a deterministic mock so you can see how the plan reacts. Apple Health & Garmin connectors live behind a feature flag.",
            ],
            [
              "What if I skip a day?",
              "The week regenerates instantly when you change inputs. Use 'Re-roll' to get a fresh take with the same constraints.",
            ],
            [
              "Is it safe for beginners?",
              "Yes — the planner caps volume and intensity by experience level and offers warm-ups, rest cues, and notes around injuries you list.",
            ],
            [
              "Can I save the plan?",
              "Print to PDF directly from the plan page (Cmd/Ctrl + P) — the layout is print-optimised. Every plan also links to a shareable URL.",
            ],
          ].map(([q, a]) => (
            <details key={q} className="group py-5">
              <summary className="cursor-pointer flex items-center justify-between gap-4 list-none">
                <span className="text-stone-900 font-medium tracking-tight">{q}</span>
                <span className="text-stone-400 group-open:rotate-45 transition-transform text-2xl leading-none">
                  +
                </span>
              </summary>
              <p className="mt-3 text-stone-600 leading-relaxed text-[15px]">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-200">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-stone-500 text-sm">
            <Logo small />
            <span>QuickFitAI · Built for casual movers, not subscribers.</span>
          </div>
          <div className="text-xs text-stone-400 numeral">
            © {new Date().getFullYear()} QuickFitAI · v1.0
          </div>
        </div>
      </footer>
    </main>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <dt className="display-serif text-3xl sm:text-4xl numeral text-stone-900">{n}</dt>
      <dd className="text-xs uppercase tracking-[0.18em] text-stone-500 mt-1">{label}</dd>
    </div>
  );
}

function PreviewCard() {
  return (
    <div className="relative">
      <div className="card-soft p-5 sm:p-6 relative">
        <div className="tape" />
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-stone-500">
          <span>Week of Apr 28</span>
          <span className="numeral">3 / 5 done</span>
        </div>
        <h3 className="display-serif text-2xl mt-2 text-stone-900">
          Build muscle · 5 days
        </h3>
        <div className="rule-h my-4" />
        <ul className="space-y-3">
          {[
            ["Mon", "Push & Core", "45 min", "✓"],
            ["Tue", "Zone-2 Run", "30 min", "✓"],
            ["Wed", "Pull & Posture", "45 min", "✓"],
            ["Thu", "Mobility Flow", "20 min", ""],
            ["Fri", "Lower Body Power", "50 min", ""],
            ["Sat", "Active Walk", "30 min", ""],
            ["Sun", "Rest", "—", ""],
          ].map(([d, t, m, s]) => (
            <li
              key={d}
              className="grid grid-cols-[40px_1fr_64px_24px] items-center text-[15px]"
            >
              <span className="text-xs uppercase tracking-wider text-stone-400">{d}</span>
              <span className="text-stone-800">{t}</span>
              <span className="text-stone-500 text-right numeral">{m}</span>
              <span className="text-orange-600 text-right">{s}</span>
            </li>
          ))}
        </ul>
        <div className="rule-h my-4" />
        <div className="flex items-center justify-between text-xs">
          <span className="chip">
            <span className="relative inline-block w-2 h-2 text-orange-500 pulse-dot rounded-full" />
            Recovery 71 · steady
          </span>
          <span className="text-stone-500">HRV 64ms · Sleep 7.4h</span>
        </div>
      </div>
      <div className="absolute -bottom-4 -right-4 hidden sm:block">
        <div className="card-soft px-4 py-3 text-xs">
          <div className="text-stone-500">Auto-adjust</div>
          <div className="font-medium text-stone-900">Fri swap → mobility (HRV ↓)</div>
        </div>
      </div>
    </div>
  );
}

function SampleWeek() {
  const days = [
    { d: "Mon", t: "Push & Core", k: "Strength", min: 35, color: "bg-stone-900 text-stone-50" },
    { d: "Tue", t: "Tempo Run", k: "Cardio", min: 30, color: "bg-stone-50" },
    { d: "Wed", t: "Conditioning Spike", k: "HIIT", min: 25, color: "bg-orange-500 text-white" },
    { d: "Thu", t: "Pull & Posture", k: "Strength", min: 35, color: "bg-stone-50" },
    { d: "Fri", t: "Sprint Ladder", k: "HIIT", min: 25, color: "bg-orange-500 text-white" },
    { d: "Sat", t: "Active Walk", k: "Recovery", min: 30, color: "bg-lime-100" },
    { d: "Sun", t: "Rest", k: "—", min: 0, color: "bg-stone-50 text-stone-400" },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
      {days.map((day) => (
        <div
          key={day.d}
          className={`day-card p-4 ${day.color} ${day.color.includes("stone-50") ? "" : "border-transparent"}`}
        >
          <div className="text-[11px] uppercase tracking-[0.18em] opacity-70">{day.d}</div>
          <div className="display-serif text-xl mt-2 leading-tight">{day.t}</div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="opacity-70">{day.k}</span>
            <span className="numeral">{day.min ? `${day.min} min` : "—"}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
