export function LogoMark({ className = 'h-8 w-8' }) {
  return (
    <span className={`inline-flex shrink-0 items-center justify-center rounded-lg bg-brand-600 ${className}`} aria-hidden="true">
      <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 17V7l7 6 7-6v10" />
      </svg>
    </span>
  )
}
