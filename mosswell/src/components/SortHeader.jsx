import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react'

export default function SortHeader({ label, field, sort, onSort, align = 'left', className = '' }) {
  const active = sort.field === field
  const Icon = !active ? ChevronsUpDown : sort.dir === 'asc' ? ChevronUp : ChevronDown
  return (
    <th className={`px-3 py-2.5 font-medium ${align === 'right' ? 'text-right' : 'text-left'} ${className}`} aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}>
      <button
        type="button"
        onClick={() => onSort(field)}
        className={`inline-flex items-center gap-1 transition hover:text-zinc-900 dark:hover:text-zinc-100 ${active ? 'text-zinc-900 dark:text-zinc-100' : ''}`}
      >
        {label}
        <Icon className={`h-3.5 w-3.5 ${active ? '' : 'opacity-50'}`} />
      </button>
    </th>
  )
}
