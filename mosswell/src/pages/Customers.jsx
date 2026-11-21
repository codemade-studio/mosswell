import { useMemo, useState } from 'react'
import { Search, Download, Plus, Mail, MapPin, X, CalendarDays, Repeat } from 'lucide-react'
import { Card, Badge, Avatar, Button, Checkbox, PageHeader, inputClass } from '../components/ui.jsx'
import Pagination from '../components/Pagination.jsx'
import SortHeader from '../components/SortHeader.jsx'
import Drawer from '../components/Drawer.jsx'
import { customers, ordersFor } from '../data/demo.js'
import { money, longDate, number } from '../lib/format.js'

const STATUSES = ['All', 'Active', 'Trial', 'Past due', 'Churned']
const PAGE_SIZE = 10

function CustomerDrawer({ customer, onClose }) {
  const c = customer
  const history = c ? ordersFor(c.id) : []
  return (
    <Drawer
      open={!!c}
      onClose={onClose}
      title="Customer details"
      footer={
        <div className="flex gap-2">
          <Button className="flex-1"><Mail className="h-4 w-4" />Email</Button>
          <Button variant="primary" className="flex-1">View all orders</Button>
        </div>
      }
    >
      {c && (
        <div className="space-y-6 p-5">
          <div className="flex items-center gap-4">
            <Avatar initials={c.initials} color={c.color} size="h-14 w-14 text-lg" />
            <div className="min-w-0">
              <p className="text-lg font-semibold">{c.name}</p>
              <p className="truncate text-sm text-zinc-500 dark:text-zinc-400">{c.email}</p>
              <div className="mt-1.5"><Badge status={c.status} /></div>
            </div>
          </div>

          <dl className="grid grid-cols-3 gap-3">
            {[
              ['Total spent', money(c.spent, 2)],
              ['Orders', number(c.orders)],
              ['Avg. order', money(c.spent / c.orders, 2)],
            ].map(([k, v]) => (
              <div key={k} className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
                <dt className="text-xs text-zinc-500 dark:text-zinc-400">{k}</dt>
                <dd className="mt-1 text-sm font-semibold tabular-nums">{v}</dd>
              </div>
            ))}
          </dl>

          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-3 text-zinc-600 dark:text-zinc-300"><Repeat className="h-4 w-4 text-zinc-400" />Plan: <span className="font-medium text-zinc-900 dark:text-zinc-100">{c.plan}</span></li>
            <li className="flex items-center gap-3 text-zinc-600 dark:text-zinc-300"><MapPin className="h-4 w-4 text-zinc-400" />{c.location}</li>
            <li className="flex items-center gap-3 text-zinc-600 dark:text-zinc-300"><CalendarDays className="h-4 w-4 text-zinc-400" />Customer since {longDate(c.joined)}</li>
          </ul>

          <div>
            <h3 className="text-sm font-semibold">Recent orders</h3>
            <ul className="mt-3 divide-y divide-zinc-100 rounded-lg border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
              {history.map((o) => (
                <li key={o.id} className="flex items-center justify-between gap-3 px-3.5 py-3 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{o.product}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{o.id} · {longDate(o.date)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium tabular-nums">{money(o.total, 2)}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{o.status}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Notes</h3>
            <textarea rows={3} placeholder="Add a private note about this customer…" className={`${inputClass} mt-3 h-auto py-2`} />
          </div>
        </div>
      )}
    </Drawer>
  )
}

export default function Customers() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('All')
  const [sort, setSort] = useState({ field: 'spent', dir: 'desc' })
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState(() => new Set())
  const [active, setActive] = useState(null)

  const counts = useMemo(() => {
    const m = { All: customers.length }
    customers.forEach((c) => (m[c.status] = (m[c.status] || 0) + 1))
    return m
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const rows = customers.filter(
      (c) =>
        (status === 'All' || c.status === status) &&
        (!q || c.name.toLowerCase().includes(q) || c.email.includes(q) || c.id.toLowerCase().includes(q) || c.location.toLowerCase().includes(q)),
    )
    const dir = sort.dir === 'asc' ? 1 : -1
    return [...rows].sort((a, b) => {
      const x = a[sort.field], y = b[sort.field]
      return (typeof x === 'number' ? x - y : String(x).localeCompare(String(y))) * dir
    })
  }, [query, status, sort])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const current = Math.min(page, pageCount)
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)

  const onSort = (field) =>
    setSort((s) => (s.field === field ? { field, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { field, dir: typeof customers[0][field] === 'number' ? 'desc' : 'asc' }))

  const allOnPage = rows.length > 0 && rows.every((r) => selected.has(r.id))
  const someOnPage = rows.some((r) => selected.has(r.id))
  const toggleAll = (on) => {
    const next = new Set(selected)
    rows.forEach((r) => (on ? next.add(r.id) : next.delete(r.id)))
    setSelected(next)
  }
  const toggleOne = (id, on) => {
    const next = new Set(selected)
    if (on) next.add(id)
    else next.delete(id)
    setSelected(next)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description={`${number(customers.length)} customers · ${counts.Active} with an active subscription`}
        actions={
          <>
            <Button><Download className="h-4 w-4" />Export CSV</Button>
            <Button variant="primary"><Plus className="h-4 w-4" />Add customer</Button>
          </>
        }
      />

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-zinc-200 p-4 lg:flex-row lg:items-center lg:justify-between dark:border-zinc-800">
          <div className="-mx-1 flex gap-1 overflow-x-auto px-1" role="tablist" aria-label="Filter by status">
            {STATUSES.map((s) => (
              <button
                key={s}
                type="button"
                role="tab"
                aria-selected={status === s}
                onClick={() => { setStatus(s); setPage(1) }}
                className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium transition ${status === s ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900' : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'}`}
              >
                {s}
                <span className={`rounded px-1 text-[11px] tabular-nums ${status === s ? 'bg-white/20 dark:bg-zinc-900/15' : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800'}`}>{counts[s] || 0}</span>
              </button>
            ))}
          </div>
          <div className="relative lg:w-72">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1) }}
              placeholder="Search name, email, city…"
              aria-label="Search customers"
              className={`${inputClass} pl-9`}
            />
          </div>
        </div>

        {selected.size > 0 && (
          <div className="flex items-center justify-between gap-3 border-b border-zinc-200 bg-brand-50/60 px-5 py-2.5 text-[13px] dark:border-zinc-800 dark:bg-brand-500/10">
            <span className="font-medium text-brand-700 dark:text-brand-400">{selected.size} selected</span>
            <div className="flex items-center gap-2">
              <Button className="h-8 text-[13px]"><Mail className="h-3.5 w-3.5" />Email</Button>
              <Button className="h-8 text-[13px]"><Download className="h-3.5 w-3.5" />Export</Button>
              <Button variant="ghost" className="h-8 px-2" onClick={() => setSelected(new Set())} aria-label="Clear selection"><X className="h-4 w-4" /></Button>
            </div>
          </div>
        )}

        <div className="md:hidden">
          <div className="flex items-center justify-between gap-3 border-b border-zinc-200 px-4 py-2.5 dark:border-zinc-800">
            <label className="flex shrink-0 items-center gap-2 whitespace-nowrap text-[13px] text-zinc-500 dark:text-zinc-400">
              <Checkbox label="Select all on this page" checked={allOnPage} indeterminate={!allOnPage && someOnPage} onChange={toggleAll} />
              Select page
            </label>
            <div className="w-40"><select
              aria-label="Sort customers"
              className={`${inputClass} h-8 text-[13px]`}
              value={`${sort.field}:${sort.dir}`}
              onChange={(e) => { const [field, dir] = e.target.value.split(':'); setSort({ field, dir }) }}
            >
              <option value="spent:desc">Top spenders</option>
              <option value="orders:desc">Most orders</option>
              <option value="lastOrder:desc">Recent orders</option>
              <option value="name:asc">Name A–Z</option>
            </select></div>
          </div>
          <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {rows.map((c) => (
              <li
                key={c.id}
                onClick={() => setActive(c)}
                className={`flex cursor-pointer items-start gap-3 px-4 py-3.5 transition-colors active:bg-zinc-50 dark:active:bg-zinc-800/40 ${selected.has(c.id) ? 'bg-brand-50/50 dark:bg-brand-500/5' : ''}`}
              >
                <span className="pt-2.5"><Checkbox label={`Select ${c.name}`} checked={selected.has(c.id)} onChange={(on) => toggleOne(c.id, on)} /></span>
                <Avatar initials={c.initials} color={c.color} size="h-9 w-9 text-xs" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-medium">{c.name}</p>
                    <p className="text-sm font-medium tabular-nums">{money(c.spent, 2)}</p>
                  </div>
                  <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">{c.email}</p>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <Badge status={c.status} />
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">{c.orders} orders · {c.plan}</span>
                  </div>
                </div>
              </li>
            ))}
            {rows.length === 0 && <li className="px-4 py-12 text-center text-sm text-zinc-500">No customers found.</li>}
          </ul>
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[860px] text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/70 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400">
                <th className="w-10 py-2.5 pl-5 pr-1 text-left">
                  <Checkbox label="Select all on this page" checked={allOnPage} indeterminate={!allOnPage && someOnPage} onChange={toggleAll} />
                </th>
                <SortHeader label="Customer" field="name" sort={sort} onSort={onSort} />
                <SortHeader label="Status" field="status" sort={sort} onSort={onSort} />
                <SortHeader label="Plan" field="plan" sort={sort} onSort={onSort} />
                <SortHeader label="Orders" field="orders" sort={sort} onSort={onSort} align="right" />
                <SortHeader label="Total spent" field="spent" sort={sort} onSort={onSort} align="right" />
                <SortHeader label="Last order" field="lastOrder" sort={sort} onSort={onSort} />
                <SortHeader label="Location" field="location" sort={sort} onSort={onSort} className="pr-5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {rows.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => setActive(c)}
                  className={`cursor-pointer transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/40 ${selected.has(c.id) ? 'bg-brand-50/50 dark:bg-brand-500/5' : ''}`}
                >
                  <td className="py-3 pl-5 pr-1"><Checkbox label={`Select ${c.name}`} checked={selected.has(c.id)} onChange={(on) => toggleOne(c.id, on)} /></td>
                  <td className="px-3 py-3">
                    <span className="flex items-center gap-3">
                      <Avatar initials={c.initials} color={c.color} />
                      <span className="min-w-0">
                        <span className="block font-medium text-zinc-900 dark:text-zinc-100">{c.name}</span>
                        <span className="block truncate text-xs text-zinc-500 dark:text-zinc-400">{c.email}</span>
                      </span>
                    </span>
                  </td>
                  <td className="px-3 py-3"><Badge status={c.status} /></td>
                  <td className="px-3 py-3 text-zinc-600 dark:text-zinc-300">{c.plan}</td>
                  <td className="px-3 py-3 text-right tabular-nums">{c.orders}</td>
                  <td className="px-3 py-3 text-right font-medium tabular-nums">{money(c.spent, 2)}</td>
                  <td className="px-3 py-3 text-zinc-500 tabular-nums dark:text-zinc-400">{longDate(c.lastOrder)}</td>
                  <td className="px-3 py-3 pr-5 text-zinc-500 dark:text-zinc-400">{c.location}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center">
                    <p className="font-medium">No customers found</p>
                    <p className="mt-1 text-sm text-zinc-500">Try a different search or status filter.</p>
                    <Button className="mt-4" onClick={() => { setQuery(''); setStatus('All') }}>Clear filters</Button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination page={current} pageCount={pageCount} total={filtered.length} pageSize={PAGE_SIZE} onChange={setPage} />
      </Card>

      <CustomerDrawer customer={active} onClose={() => setActive(null)} />
    </div>
  )
}
