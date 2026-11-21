import { useMemo, useState } from 'react'
import { Search, Download } from 'lucide-react'
import { Card, Badge, Avatar, Button, PageHeader, Segmented, inputClass } from '../components/ui.jsx'
import Pagination from '../components/Pagination.jsx'
import SortHeader from '../components/SortHeader.jsx'
import { orders } from '../data/demo.js'
import { money } from '../lib/format.js'

const PAGE_SIZE = 12
const when = (iso) => new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })

export default function Orders() {
  const [status, setStatus] = useState('All')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState({ field: 'placed', dir: 'desc' })
  const [page, setPage] = useState(1)

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    const r = orders.filter((o) => (status === 'All' || o.status === status) && (!q || o.id.toLowerCase().includes(q) || o.customer.name.toLowerCase().includes(q) || o.product.toLowerCase().includes(q)))
    const dir = sort.dir === 'asc' ? 1 : -1
    const val = (o) => (sort.field === 'customer' ? o.customer.name : o[sort.field])
    return [...r].sort((a, b) => {
      const x = val(a), y = val(b)
      return (typeof x === 'number' ? x - y : String(x).localeCompare(String(y))) * dir
    })
  }, [status, query, sort])

  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const current = Math.min(page, pageCount)
  const onSort = (field) => setSort((s) => (s.field === field ? { field, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { field, dir: 'desc' }))

  return (
    <div className="space-y-6">
      <PageHeader title="Orders" description="Every order across your store, subscriptions, and wholesale." actions={<Button><Download className="h-4 w-4" />Export</Button>} />
      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-zinc-200 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
          <div className="overflow-x-auto">
            <Segmented label="Order status" options={['All', 'Paid', 'Fulfilled', 'Pending', 'Refunded']} value={status} onChange={(v) => { setStatus(v); setPage(1) }} />
          </div>
          <div className="relative sm:w-72">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input type="search" value={query} onChange={(e) => { setQuery(e.target.value); setPage(1) }} placeholder="Search orders…" aria-label="Search orders" className={`${inputClass} pl-9`} />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/70 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400">
                <SortHeader label="Order" field="id" sort={sort} onSort={onSort} className="pl-5" />
                <SortHeader label="Date" field="placed" sort={sort} onSort={onSort} />
                <SortHeader label="Customer" field="customer" sort={sort} onSort={onSort} />
                <th className="px-3 py-2.5 text-left font-medium">Product</th>
                <SortHeader label="Channel" field="channel" sort={sort} onSort={onSort} />
                <SortHeader label="Status" field="status" sort={sort} onSort={onSort} />
                <SortHeader label="Total" field="total" sort={sort} onSort={onSort} align="right" className="pr-5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {rows.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE).map((o) => (
                <tr key={o.id} className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                  <td className="px-3 py-3 pl-5 font-medium tabular-nums">{o.id}</td>
                  <td className="px-3 py-3 text-zinc-500 dark:text-zinc-400">{when(o.placed)}</td>
                  <td className="px-3 py-3">
                    <span className="flex items-center gap-2.5"><Avatar initials={o.customer.initials} color={o.customer.color} size="h-7 w-7 text-[11px]" />{o.customer.name}</span>
                  </td>
                  <td className="max-w-[220px] truncate px-3 py-3 text-zinc-600 dark:text-zinc-300">{o.product}{o.items > 1 && <span className="text-zinc-400"> +{o.items - 1}</span>}</td>
                  <td className="px-3 py-3 text-zinc-500 dark:text-zinc-400">{o.channel}</td>
                  <td className="px-3 py-3"><Badge status={o.status} /></td>
                  <td className="px-3 py-3 pr-5 text-right font-medium tabular-nums">{money(o.total, 2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={current} pageCount={pageCount} total={rows.length} pageSize={PAGE_SIZE} onChange={setPage} />
      </Card>
    </div>
  )
}
