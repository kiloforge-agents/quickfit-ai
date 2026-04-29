"use client";

import { useEffect, useState } from "react";

export default function LiveBadge() {
  const [hrv, setHrv] = useState(64);
  useEffect(() => {
    const t = setInterval(() => {
      setHrv((h) => {
        const next = h + (Math.random() - 0.5) * 4;
        return Math.max(48, Math.min(82, Math.round(next)));
      });
    }, 1800);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="chip numeral">
      <span className="relative inline-block w-1.5 h-1.5 text-orange-500 pulse-dot rounded-full bg-orange-500" />
      Live · HRV {hrv}ms
    </span>
  );
}
