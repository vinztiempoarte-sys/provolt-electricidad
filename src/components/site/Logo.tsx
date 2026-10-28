/** Logotipo Provolt: símbolo (rayo + arco) en SVG y rótulo textual. Pensado para fondos oscuros. */
export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true" focusable="false">
      <circle
        cx="100"
        cy="100"
        r="77"
        fill="none"
        stroke="currentColor"
        strokeWidth="9"
        strokeDasharray="430 45"
        transform="rotate(-82 100 100)"
      />
      <path d="M125 10 L53 116 H101 L75 193 L155 86 H106 Z" fill="currentColor" />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2.5 font-display ${className}`}
      aria-label="Provolt Electricidad"
    >
      <LogoMark className="size-8 text-[#00B8F8] drop-shadow-[0_0_8px_rgba(0,184,248,0.55)]" />
      <span className="flex flex-col leading-none">
        <span className="text-xl font-bold tracking-tight">PROVOLT</span>
        <span className="mt-0.5 text-[0.55rem] font-medium tracking-[0.32em] text-[#00B8F8]">
          ELECTRICIDAD
        </span>
      </span>
    </span>
  );
}
