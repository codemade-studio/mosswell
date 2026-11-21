import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ page, pageCount, total, pageSize, onChange }) {
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1)
  const btn = 'inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-[13px] font-medium transition disabled:pointer-events-none disabled:opacity-40'
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 px-5 py-3 text-[13px] text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
      <p>
        Showing <span className="font-medium text-zinc-900 dark:text-zinc-100">{from}–{to}</span> of{' '}
        <span className="font-medium text-zinc-900 dark:text-zinc-100">{total}</span>
      </p>
      <nav className="flex items-center gap-1" aria-label="Pagination">
        <button type="button" className={`${btn} hover:bg-zinc-100 dark:hover:bg-zinc-800`} disabled={page === 1} onClick={() => onChange(page - 1)} aria-label="Previous page">
          <ChevronLeft className="h-4 w-4" />
        </button>
        {pages.map((p) => (
          <button
            key={p}
            type="button"
            aria-current={p === page ? 'page' : undefined}
            onClick={() => onChange(p)}
            className={`${btn} ${p === page ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
          >
            {p}
          </button>
        ))}
        <button type="button" className={`${btn} hover:bg-zinc-100 dark:hover:bg-zinc-800`} disabled={page === pageCount || pageCount === 0} onClick={() => onChange(page + 1)} aria-label="Next page">
          <ChevronRight className="h-4 w-4" />
        </button>
      </nav>
    </div>
  )
}
