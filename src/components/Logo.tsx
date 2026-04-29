export function Logo({ small = false }: { small?: boolean }) {
  const size = small ? 18 : 22;
  return (
    <span
      aria-hidden="true"
      className="inline-flex items-center justify-center rounded-md bg-stone-900 text-stone-50"
      style={{ width: size + 6, height: size + 6 }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6.5 6.5l11 11" />
        <path d="M3 9l3-3 9 9-3 3z" />
        <path d="M15 3l6 6" />
        <path d="M9 21l-6-6" />
      </svg>
    </span>
  );
}
