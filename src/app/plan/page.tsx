import Link from "next/link";
import { Suspense } from "react";
import PlanView from "@/components/PlanView";
import { Logo } from "@/components/Logo";

export default function PlanPage() {
  return (
    <main className="flex-1">
      <header className="border-b border-stone-200 bg-stone-50/80 backdrop-blur sticky top-0 z-30 print:hidden">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 text-stone-900">
            <Logo />
            <span className="font-semibold tracking-tight">QuickFitAI</span>
          </Link>
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/#builder" className="px-3 py-1.5 text-stone-600 hover:text-stone-900">
              Edit inputs
            </Link>
            <Link href="/" className="px-3 py-1.5 rounded-md bg-stone-900 text-stone-50 hover:bg-stone-800">
              Start over
            </Link>
          </nav>
        </div>
      </header>

      <Suspense fallback={<PlanLoading />}>
        <PlanView />
      </Suspense>

      <footer className="border-t border-stone-200 print:hidden">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-10 text-sm text-stone-500 flex flex-col sm:flex-row gap-4 justify-between">
          <span>QuickFitAI · Free, forever. Built for casual movers.</span>
          <span className="text-xs text-stone-400">
            Plans are educational. Consult a professional for medical concerns.
          </span>
        </div>
      </footer>
    </main>
  );
}

function PlanLoading() {
  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8 py-20">
      <div className="animate-pulse space-y-4">
        <div className="h-10 w-64 bg-stone-200 rounded" />
        <div className="h-4 w-96 bg-stone-200 rounded" />
        <div className="h-32 w-full bg-stone-100 rounded mt-8" />
      </div>
    </div>
  );
}
