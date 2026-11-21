/**
 * Fictional demo data for Mosswell — a concept dashboard.
 * Store: "Halden Coffee Co.", a made-up specialty coffee brand selling
 * one-off orders and coffee subscriptions. Everything here is generated.
 */

function rng(seed) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const rand = rng(20261122)
const pick = (arr) => arr[Math.floor(rand() * arr.length)]
const between = (a, b) => a + rand() * (b - a)

export const TODAY = new Date('2026-11-22T12:00:00')
const dayMs = 86400000
const daysAgo = (n) => new Date(TODAY.getTime() - n * dayMs)
const iso = (d) => d.toISOString().slice(0, 10)

/* ---------- Daily series (180 days so we can compare periods) ---------- */
export const daily = Array.from({ length: 180 }, (_, i) => {
  const ago = 179 - i
  const d = daysAgo(ago)
  const trend = 1 + (179 - ago) * 0.0032
  const weekday = [0.82, 1.04, 1.0, 1.02, 1.08, 1.18, 0.9][d.getDay()]
  const bfcm = ago <= 3 ? 1.35 : 1
  const revenue = Math.round(4200 * trend * weekday * bfcm * between(0.86, 1.14))
  const orders = Math.round(revenue / between(46, 54))
  const visitors = Math.round(orders / between(0.029, 0.036))
  const subs = Math.round(1850 + (179 - ago) * 3.4 + between(-6, 6))
  return { date: iso(d), revenue, orders, visitors, subs }
})

export function series(days) {
  const cur = daily.slice(-days)
  const prev = daily.slice(-days * 2, -days)
  return cur.map((d, i) => ({ ...d, previous: prev[i]?.revenue ?? null }))
}

const sum = (arr, k) => arr.reduce((s, d) => s + d[k], 0)

export function kpis(days) {
  const cur = daily.slice(-days)
  const prev = daily.slice(-days * 2, -days)
  const change = (a, b) => ((a - b) / b) * 100
  const rev = sum(cur, 'revenue'), prevRev = sum(prev, 'revenue')
  const ord = sum(cur, 'orders'), prevOrd = sum(prev, 'orders')
  const conv = (ord / sum(cur, 'visitors')) * 100, prevConv = (prevOrd / sum(prev, 'visitors')) * 100
  const subs = cur.at(-1).subs, prevSubs = prev.at(-1).subs
  return [
    { key: 'revenue', label: 'Net revenue', value: rev, format: 'money', change: change(rev, prevRev), spark: cur.map((d) => ({ v: d.revenue })) },
    { key: 'orders', label: 'Orders', value: ord, format: 'number', change: change(ord, prevOrd), spark: cur.map((d) => ({ v: d.orders })) },
    { key: 'subs', label: 'Active subscribers', value: subs, format: 'number', change: change(subs, prevSubs), spark: cur.map((d) => ({ v: d.subs })) },
    { key: 'conv', label: 'Conversion rate', value: conv, format: 'pct', change: change(conv, prevConv), spark: cur.map((_, i) => { const w = daily.slice(-days - 6 + i, -days + i + 1 || undefined); return { v: sum(w, 'orders') / sum(w, 'visitors') } }) },
  ]
}

export const channels = [
  { name: 'Online store', value: 48, color: '#059669' },
  { name: 'Subscriptions', value: 31, color: '#34d399' },
  { name: 'Wholesale', value: 13, color: '#0ea5e9' },
  { name: 'Marketplaces', value: 8, color: '#a1a1aa' },
]

export const topProducts = [
  { name: 'Morning Ritual Blend · 1kg', sold: 1284, revenue: 41088 },
  { name: 'Ethiopia Guji · Single origin', sold: 932, revenue: 22368 },
  { name: 'Monthly Discovery Box', sold: 846, revenue: 25380 },
  { name: 'Decaf Night Owl · 500g', sold: 511, revenue: 9198 },
  { name: 'Pour-over Starter Kit', sold: 204, revenue: 13260 },
]

/* ---------- Customers ---------- */
const first = ['Olivia', 'Liam', 'Amelia', 'Noah', 'Isla', 'Oliver', 'Mia', 'Jack', 'Charlotte', 'Leo', 'Ava', 'Lucas', 'Grace', 'Henry', 'Zoe', 'Ethan', 'Chloe', 'Mason', 'Ruby', 'Harper', 'Aria', 'Kai', 'Hana', 'Arjun', 'Mei', 'Daniel', 'Sofia', 'Ivy', 'Theo', 'Nora', 'Ezra', 'Layla']
const last = ['Thompson', 'Nguyen', 'Walker', 'Patel', 'Kim', 'Harris', 'Tan', 'Martin', 'Wilson', 'Lee', 'Brown', 'Singh', 'Clarke', 'Wong', 'Taylor', 'Murphy', 'Ng', 'Cooper', 'Rossi', 'Fraser', 'Lim', 'Chen', 'Bennett', 'Ali']
const cities = ['Melbourne, AU', 'Sydney, AU', 'Auckland, NZ', 'Brisbane, AU', 'Wellington, NZ', 'Perth, AU', 'Singapore, SG', 'London, UK', 'Adelaide, AU', 'Christchurch, NZ']
const plans = ['Discovery', 'Ritual', 'Roaster’s Pick', 'One-off']
const statuses = ['Active', 'Active', 'Active', 'Active', 'Trial', 'Past due', 'Churned']
const avatarColors = ['bg-emerald-500', 'bg-sky-500', 'bg-violet-500', 'bg-amber-500', 'bg-rose-500', 'bg-teal-500', 'bg-indigo-500', 'bg-orange-500']

export const customers = Array.from({ length: 64 }, (_, i) => {
  const f = pick(first), l = pick(last)
  const status = pick(statuses)
  const orders = status === 'Trial' ? 1 : Math.round(between(2, 38))
  const joined = daysAgo(Math.round(between(10, 720)))
  return {
    id: `CUS-${String(1042 + i * 7).padStart(5, '0')}`,
    name: `${f} ${l}`,
    initials: `${f[0]}${l[0]}`,
    email: `${f}.${l}${i % 3 === 0 ? '' : Math.round(between(1, 99))}@${pick(['gmail.com', 'outlook.com', 'icloud.com', 'proton.me', 'fastmail.com'])}`.toLowerCase(),
    color: avatarColors[i % avatarColors.length],
    status,
    plan: status === 'Trial' ? 'Discovery' : pick(plans),
    orders,
    spent: Math.round(orders * between(28, 64) * 100) / 100,
    joined: iso(joined),
    lastOrder: iso(daysAgo(Math.round(between(0, status === 'Churned' ? 200 : 40)))),
    location: pick(cities),
  }
})

/* ---------- Orders ---------- */
const orderStatus = ['Paid', 'Paid', 'Paid', 'Fulfilled', 'Fulfilled', 'Pending', 'Refunded']
export const orders = Array.from({ length: 96 }, (_, i) => {
  const c = customers[Math.floor(rand() * customers.length)]
  const minutes = i * 37 + Math.round(between(0, 30))
  const placed = new Date(TODAY.getTime() - minutes * 60000)
  return {
    id: `#HC-${18420 - i}`,
    customer: c,
    items: Math.ceil(between(0.2, 4)),
    product: pick(topProducts).name,
    total: Math.round(between(22, 189) * 100) / 100,
    status: pick(orderStatus),
    channel: pick(['Online store', 'Subscription', 'Subscription', 'Wholesale', 'Marketplace']),
    placed: placed.toISOString(),
  }
})

export function ordersFor(customerId) {
  const c = customers.find((x) => x.id === customerId)
  return Array.from({ length: Math.min(4, c.orders) }, (_, i) => ({
    id: `#HC-${17000 + (parseInt(customerId.slice(4), 10) % 900) + i * 13}`,
    product: topProducts[(i + c.orders) % topProducts.length].name,
    total: Math.round((c.spent / c.orders) * (0.8 + i * 0.12) * 100) / 100,
    date: iso(new Date(new Date(c.lastOrder).getTime() - i * 30 * dayMs)),
    status: i === 0 && c.status === 'Past due' ? 'Pending' : 'Fulfilled',
  }))
}

export const notifications = [
  { id: 1, title: 'Payout of $18,240.55 sent', body: 'Arrives in your bank account by Nov 24.', time: '12m ago', unread: true },
  { id: 2, title: '14 subscriptions renew tomorrow', body: '3 cards on file expire this month.', time: '1h ago', unread: true },
  { id: 3, title: 'Low stock: Ethiopia Guji', body: '42 bags left — about 5 days of sales.', time: '3h ago', unread: true },
  { id: 4, title: 'Weekly report is ready', body: 'Revenue up 12.4% week over week.', time: 'Yesterday', unread: false },
]

export const team = [
  { name: 'Hannah Okafor', email: 'hannah@haldencoffee.co', role: 'Owner', initials: 'HO', color: 'bg-emerald-500' },
  { name: 'Tom Becker', email: 'tom@haldencoffee.co', role: 'Admin', initials: 'TB', color: 'bg-sky-500' },
  { name: 'Ana Lopes', email: 'ana@haldencoffee.co', role: 'Editor', initials: 'AL', color: 'bg-violet-500' },
  { name: 'Ravi Menon', email: 'ravi@haldencoffee.co', role: 'Viewer', initials: 'RM', color: 'bg-amber-500' },
]
