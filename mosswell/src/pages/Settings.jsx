import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { Check, Plus } from 'lucide-react'
import { Card, Avatar, Button, Field, Toggle, PageHeader, inputClass } from '../components/ui.jsx'
import { team } from '../data/demo.js'

const tabs = [
  { id: 'profile', label: 'Profile' },
  { id: 'team', label: 'Team' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'billing', label: 'Billing' },
]

function Section({ title, description, children }) {
  return (
    <div className="grid gap-6 py-8 first:pt-0 last:pb-0 lg:grid-cols-[280px_1fr]">
      <div>
        <h2 className="text-sm font-semibold">{title}</h2>
        <p className="mt-1 text-[13px] leading-relaxed text-zinc-500 dark:text-zinc-400">{description}</p>
      </div>
      <div>{children}</div>
    </div>
  )
}

function Profile() {
  const [saved, setSaved] = useState(false)
  return (
    <form className="divide-y divide-zinc-200 dark:divide-zinc-800" onSubmit={(e) => { e.preventDefault(); setSaved(true); setTimeout(() => setSaved(false), 2000) }}>
      <Section title="Personal information" description="This is shown to your teammates and on exported reports.">
        <Card className="p-5 sm:p-6">
          <div className="flex items-center gap-4">
            <Avatar initials="HO" color="bg-emerald-600" size="h-14 w-14 text-lg" />
            <div className="flex gap-2">
              <Button>Change photo</Button>
              <Button variant="ghost">Remove</Button>
            </div>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <Field label="First name"><input className={inputClass} defaultValue="Hannah" /></Field>
            <Field label="Last name"><input className={inputClass} defaultValue="Okafor" /></Field>
            <Field label="Email"><input type="email" className={inputClass} defaultValue="hannah@haldencoffee.co" /></Field>
            <Field label="Role"><input className={inputClass} defaultValue="Founder" /></Field>
          </div>
        </Card>
      </Section>
      <Section title="Store details" description="Used on invoices, receipts, and your customer emails.">
        <Card className="p-5 sm:p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Store name"><input className={inputClass} defaultValue="Halden Coffee Co." /></Field>
            <Field label="Store URL"><input className={inputClass} defaultValue="haldencoffee.co" /></Field>
            <Field label="Currency">
              <select className={inputClass} defaultValue="USD">
                <option value="USD">USD — US Dollar</option>
                <option value="AUD">AUD — Australian Dollar</option>
                <option value="NZD">NZD — New Zealand Dollar</option>
              </select>
            </Field>
            <Field label="Timezone">
              <select className={inputClass} defaultValue="Melbourne">
                <option value="Melbourne">(GMT+11) Melbourne</option>
                <option value="Auckland">(GMT+13) Auckland</option>
                <option value="Singapore">(GMT+8) Singapore</option>
              </select>
            </Field>
            <div className="sm:col-span-2">
              <Field label="Store description" hint="Shown in your store footer. Max 160 characters.">
                <textarea rows={3} className={`${inputClass} h-auto py-2`} defaultValue="Small-batch specialty coffee, roasted weekly in Melbourne and delivered on your schedule." />
              </Field>
            </div>
          </div>
        </Card>
      </Section>
      <div className="flex items-center justify-end gap-3 pt-6">
        {saved && <span className="flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400"><Check className="h-4 w-4" />Saved</span>}
        <Button>Cancel</Button>
        <Button variant="primary" type="submit">Save changes</Button>
      </div>
    </form>
  )
}

function Team() {
  const [members, setMembers] = useState(team)
  return (
    <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
      <Section title="Invite teammates" description="Teammates get access to this workspace. You can change roles any time.">
        <Card className="p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input type="email" placeholder="name@haldencoffee.co" aria-label="Email address" className={inputClass} />
            <div className="shrink-0 sm:w-36"><select className={inputClass} defaultValue="Editor" aria-label="Role">
              <option>Admin</option><option>Editor</option><option>Viewer</option>
            </select></div>
            <Button variant="primary" className="shrink-0"><Plus className="h-4 w-4" />Send invite</Button>
          </div>
        </Card>
      </Section>
      <Section title="Members" description={`${members.length} people in Halden Coffee Co.`}>
        <Card className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {members.map((m, i) => (
            <div key={m.email} className="flex flex-wrap items-center gap-3 px-5 py-4">
              <Avatar initials={m.initials} color={m.color} size="h-9 w-9 text-xs" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{m.name}</p>
                <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">{m.email}</p>
              </div>
              {m.role === 'Owner' ? (
                <span className="rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">Owner</span>
              ) : (
                <div className="w-28 shrink-0"><select
                  aria-label={`Role for ${m.name}`}
                  className={`${inputClass} h-8 text-[13px]`}
                  value={m.role}
                  onChange={(e) => setMembers(members.map((x, j) => (j === i ? { ...x, role: e.target.value } : x)))}
                >
                  <option>Admin</option><option>Editor</option><option>Viewer</option>
                </select></div>
              )}
            </div>
          ))}
        </Card>
      </Section>
    </div>
  )
}

function Notifications() {
  const [prefs, setPrefs] = useState({ orders: true, payouts: true, stock: true, weekly: true, churn: false, product: false })
  const rows = [
    ['orders', 'New orders', 'Get notified for every new order over $100.'],
    ['payouts', 'Payouts', 'When a payout is sent to your bank account.'],
    ['stock', 'Low stock alerts', 'When a product has less than a week of stock left.'],
    ['weekly', 'Weekly summary', 'A Monday morning email with last week’s numbers.'],
    ['churn', 'Churn risk', 'When a subscriber skips two deliveries in a row.'],
    ['product', 'Product updates', 'News about new Mosswell features.'],
  ]
  return (
    <Section title="Email notifications" description="Choose what Mosswell emails you about. Critical security emails are always sent.">
      <Card className="divide-y divide-zinc-100 dark:divide-zinc-800">
        {rows.map(([k, t, d]) => (
          <div key={k} className="flex items-center justify-between gap-6 px-5 py-4">
            <div>
              <p className="text-sm font-medium">{t}</p>
              <p className="mt-0.5 text-[13px] text-zinc-500 dark:text-zinc-400">{d}</p>
            </div>
            <Toggle label={t} checked={prefs[k]} onChange={(v) => setPrefs({ ...prefs, [k]: v })} />
          </div>
        ))}
      </Card>
    </Section>
  )
}

function Billing() {
  return (
    <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
      <Section title="Current plan" description="You’re on the Pro plan, billed yearly.">
        <Card className="p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold">Pro <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-semibold text-brand-700 dark:bg-brand-500/15 dark:text-brand-400">Yearly</span></p>
              <p className="mt-2 text-3xl font-semibold tracking-tight">$79<span className="text-sm font-normal text-zinc-500"> / month</span></p>
              <p className="mt-1 text-[13px] text-zinc-500 dark:text-zinc-400">Renews on Mar 1, 2027</p>
            </div>
            <div className="flex gap-2"><Button>Cancel plan</Button><Button variant="primary">Upgrade</Button></div>
          </div>
          <div className="mt-6">
            <div className="flex justify-between text-[13px]"><span className="text-zinc-500 dark:text-zinc-400">Orders this month</span><span className="font-medium tabular-nums">4,115 / 10,000</span></div>
            <div className="mt-2 h-2 rounded-full bg-zinc-100 dark:bg-zinc-800"><div className="h-2 w-[41%] rounded-full bg-brand-500" /></div>
          </div>
        </Card>
      </Section>
      <Section title="Payment method" description="Charged on each renewal.">
        <Card className="flex items-center gap-4 p-5">
          <span className="flex h-9 w-14 items-center justify-center rounded-md bg-zinc-900 text-[11px] font-bold tracking-wider text-white dark:bg-zinc-100 dark:text-zinc-900">VISA</span>
          <div className="flex-1"><p className="text-sm font-medium">Visa ending in 4242</p><p className="text-xs text-zinc-500">Expires 08/2028</p></div>
          <Button>Update</Button>
        </Card>
      </Section>
    </div>
  )
}

export default function Settings() {
  const [params, setParams] = useSearchParams()
  const tab = tabs.some((t) => t.id === params.get('tab')) ? params.get('tab') : 'profile'
  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage your profile, team, and workspace preferences." />
      <div className="-mx-4 overflow-x-auto border-b border-zinc-200 px-4 sm:mx-0 sm:px-0 dark:border-zinc-800">
        <nav className="flex gap-6" role="tablist" aria-label="Settings sections">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setParams(t.id === 'profile' ? {} : { tab: t.id })}
              className={`-mb-px shrink-0 border-b-2 pb-3 text-sm font-medium transition ${tab === t.id ? 'border-brand-600 text-zinc-900 dark:border-brand-400 dark:text-zinc-100' : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'}`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="pt-2">
        {tab === 'profile' && <Profile />}
        {tab === 'team' && <Team />}
        {tab === 'notifications' && <Notifications />}
        {tab === 'billing' && <Billing />}
      </div>
    </div>
  )
}
