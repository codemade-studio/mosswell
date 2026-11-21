import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { Area, AreaChart, YAxis as SparkY, CartesianGrid, Line, ComposedChart, Pie, PieChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ArrowDownRight, ArrowUpRight, Download, Calendar } from 'lucide-react'
import { Card, CardHeader, Badge, Avatar, Button, Segmented, PageHeader } from '../components/ui.jsx'
import { kpis, series, channels, topProducts, orders } from '../data/demo.js'
import { money, number, compactMoney, shortDate } from '../lib/format.js'
import { useTheme, chartColors } from '../lib/theme.jsx'

const ranges = [
  { value: 7, label: '7d' },
  { value: 30, label: '30d' },
  { value: 90, label: '90d' },
]

function formatValue(k) {
  if (k.format === 'money') return money(k.value)
  if (k.format === 'pct') return `${k.value.toFixed(2)}%`
  return number(k.value)
}

function Kpi({ k, c }) {
  const up = k.change >= 0
  const color = up ? c.brand : '#f43f5e'
  return (
    <Card className="p-5">
      <p className="text-[13px] font-medium text-zinc-500 dark:text-zinc-400">{k.label}</p>
      <div className="mt-2 flex items-end justify-between gap-3">
        <div>
          <p className="text-2xl font-semibold tracking-tight tabular-nums">{formatValue(k)}</p>
          <p className={`mt-1.5 inline-flex items-center gap-0.5 text-xs font-medium ${up ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
            {up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            {Math.abs(k.change).toFixed(1)}%
            <span className="ml-1 font-normal text-zinc-400">vs prev.</span>
          </p>
        </div>
        <div className="h-11 w-24" aria-hidden="true">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={k.spark} margin={{ top: 2, right: 0, bottom: 2, left: 0 }}>
              <defs>
                <linearGradient id={`spark-${k.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <SparkY hide domain={['dataMin', 'dataMax']} />
              <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.75} fill={`url(#spark-${k.key})`} isAnimationActive={false} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  )
}

function ChartTooltip({ active, payload, label, c }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border px-3 py-2 text-xs shadow-lg" style={{ background: c.tooltipBg, borderColor: c.tooltipBorder, color: c.text }}>
      <p className="mb-1 font-medium">{shortDate(label)}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="flex items-center gap-2 tabular-nums">
          <span className="h-2 w-2 rounded-full" style={{ background: p.dataKey === 'revenue' ? c.brand : c.axis }} />
          {p.dataKey === 'revenue' ? 'This period' : 'Previous'}: <span className="font-semibold">{money(p.value)}</span>
        </p>
      ))}
    </div>
  )
}

export default function Overview() {
  const [range, setRange] = useState(30)
  const { theme } = useTheme()
  const c = chartColors(theme)
  const data = useMemo(() => series(range), [range])
  const cards = useMemo(() => kpis(range), [range])
  const total = cards[0].value

  return (
    <div className="space-y-6">
      <PageHeader
        title="Good morning, Hannah"
        description="Here’s how Halden Coffee Co. is doing."
        actions={
          <>
            <Segmented label="Date range" options={ranges} value={range} onChange={setRange} />
            <span className="hidden sm:block"><Button><Calendar className="h-4 w-4" />Nov 22, 2026</Button></span>
            <Button variant="primary"><Download className="h-4 w-4" />Export</Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((k) => <Kpi key={k.key} k={k} c={c} />)}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader
            title="Revenue"
            subtitle={`${money(total)} in the last ${range} days`}
            action={
              <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: c.brand }} />This period</span>
                <span className="flex items-center gap-1.5"><span className="h-0.5 w-3 rounded" style={{ background: c.axis }} />Previous</span>
              </div>
            }
          />
          <div className="h-72 px-2 pt-4 pb-3">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={c.brandFill} stopOpacity={0.22} />
                    <stop offset="100%" stopColor={c.brandFill} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke={c.grid} />
                <XAxis
                  dataKey="date"
                  tickFormatter={shortDate}
                  tick={{ fill: c.axis, fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  minTickGap={28}
                  dy={6}
                />
                <YAxis tickFormatter={compactMoney} tick={{ fill: c.axis, fontSize: 12 }} axisLine={false} tickLine={false} width={52} />
                <Tooltip content={<ChartTooltip c={c} />} cursor={{ stroke: c.axis, strokeDasharray: '3 3' }} />
                <Line type="monotone" dataKey="previous" stroke={c.axis} strokeWidth={1.5} strokeDasharray="4 4" dot={false} isAnimationActive={false} />
                <Area type="monotone" dataKey="revenue" stroke={c.brand} strokeWidth={2} fill="url(#rev)" isAnimationActive={false} activeDot={{ r: 4, strokeWidth: 0 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Sales by channel" subtitle="Share of net revenue" />
          <div className="flex flex-col items-center gap-4 p-5 sm:flex-row xl:flex-col">
            <div className="relative h-44 w-44 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={channels} dataKey="value" innerRadius={56} outerRadius={80} paddingAngle={2} stroke="none" isAnimationActive={false}>
                    {channels.map((ch) => <Cell key={ch.name} fill={ch.name === 'Marketplaces' ? c.muted : ch.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-semibold tabular-nums">{compactMoney(total)}</span>
                <span className="text-[11px] text-zinc-500">{range} days</span>
              </div>
            </div>
            <ul className="w-full space-y-2.5">
              {channels.map((ch) => (
                <li key={ch.name} className="flex items-center gap-2.5 text-sm">
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ background: ch.name === 'Marketplaces' ? c.muted : ch.color }} />
                  <span className="flex-1 text-zinc-600 dark:text-zinc-300">{ch.name}</span>
                  <span className="font-medium tabular-nums">{ch.value}%</span>
                  <span className="w-16 text-right text-xs text-zinc-400 tabular-nums">{compactMoney((total * ch.value) / 100)}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="overflow-hidden xl:col-span-2">
          <CardHeader
            title="Recent orders"
            subtitle="Latest activity across all channels"
            action={<Link to="/orders" className="text-[13px] font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400">View all</Link>}
          />
          <ul className="mt-4 divide-y divide-zinc-100 border-t border-zinc-200 sm:hidden dark:divide-zinc-800 dark:border-zinc-800">
            {orders.slice(0, 6).map((o) => (
              <li key={o.id} className="flex items-center gap-3 px-5 py-3">
                <Avatar initials={o.customer.initials} color={o.customer.color} size="h-8 w-8 text-[11px]" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{o.customer.name}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">{o.id} · {o.channel}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-sm font-medium tabular-nums">{money(o.total, 2)}</span>
                  <Badge status={o.status} />
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 hidden overflow-x-auto sm:block">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-y border-zinc-200 bg-zinc-50/70 text-left text-xs font-medium text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400">
                  <th className="px-5 py-2.5 font-medium">Order</th>
                  <th className="px-3 py-2.5 font-medium">Customer</th>
                  <th className="px-3 py-2.5 font-medium">Channel</th>
                  <th className="px-3 py-2.5 font-medium">Status</th>
                  <th className="px-5 py-2.5 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {orders.slice(0, 6).map((o) => (
                  <tr key={o.id} className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                    <td className="px-5 py-3 font-medium tabular-nums">{o.id}</td>
                    <td className="px-3 py-3">
                      <span className="flex items-center gap-2.5">
                        <Avatar initials={o.customer.initials} color={o.customer.color} size="h-7 w-7 text-[11px]" />
                        <span className="truncate">{o.customer.name}</span>
                      </span>
                    </td>
                    <td className="px-3 py-3 text-zinc-500 dark:text-zinc-400">{o.channel}</td>
                    <td className="px-3 py-3"><Badge status={o.status} /></td>
                    <td className="px-5 py-3 text-right font-medium tabular-nums">{money(o.total, 2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <CardHeader title="Top products" subtitle="By units sold, last 90 days" />
          <ul className="space-y-4 p-5">
            {topProducts.map((p) => (
              <li key={p.name}>
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="truncate font-medium">{p.name}</span>
                  <span className="shrink-0 text-xs text-zinc-500 tabular-nums">{number(p.sold)} sold</span>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <div className="h-1.5 rounded-full bg-brand-500" style={{ width: `${(p.sold / topProducts[0].sold) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}
