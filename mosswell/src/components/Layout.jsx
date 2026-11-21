import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router'
import {
  LayoutDashboard, ShoppingBag, Users, Package, ChartColumn, Settings, Search, Bell, Sun, Moon,
  PanelLeftClose, PanelLeft, Menu as MenuIcon, X, LogOut, User, CreditCard, ArrowUpRight, ChevronsUpDown,
} from 'lucide-react'
import { LogoMark } from './Logo.jsx'
import Menu from './Menu.jsx'
import { Avatar } from './ui.jsx'
import { useTheme } from '../lib/theme.jsx'
import { notifications } from '../data/demo.js'

const nav = [
  { to: '/', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/orders', label: 'Orders', icon: ShoppingBag, count: 12 },
  { to: '/customers', label: 'Customers', icon: Users },
  { to: '/products', label: 'Products', icon: Package },
  { to: '/reports', label: 'Reports', icon: ChartColumn },
]

function Sidebar({ collapsed, onToggle, onNavigate, mobile }) {
  const show = mobile || !collapsed
  const item = ({ isActive }) =>
    `group flex h-9 items-center gap-3 rounded-lg px-2.5 text-sm font-medium transition-colors ${
      isActive
        ? 'bg-zinc-900/5 text-zinc-900 dark:bg-white/10 dark:text-white'
        : 'text-zinc-600 hover:bg-zinc-900/5 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-zinc-100'
    } ${show ? '' : 'justify-center'}`

  return (
    <div className="flex h-full flex-col">
      <div className={`flex h-14 items-center gap-2.5 px-4 ${show ? '' : 'justify-center px-0'}`}>
        <LogoMark />
        {show && <span className="text-[15px] font-semibold tracking-tight">Mosswell</span>}
        {mobile && (
          <button type="button" onClick={onNavigate} aria-label="Close menu" className="ml-auto rounded-md p-1.5 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {show && (
        <div className="px-3 pt-2">
          <button type="button" className="flex w-full items-center gap-2.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-2 text-left transition hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-700 text-[11px] font-bold text-white">H</span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-semibold">Halden Coffee Co.</span>
              <span className="block text-[11px] text-zinc-500">Pro workspace</span>
            </span>
            <ChevronsUpDown className="h-4 w-4 text-zinc-400" />
          </button>
        </div>
      )}

      <nav className="mt-4 flex-1 px-3" aria-label="Main">
        {show && <p className="px-2.5 pb-2 text-[11px] font-medium uppercase tracking-wider text-zinc-400">Store</p>}
        <ul className="space-y-0.5">
          {nav.map(({ to, label, icon: Icon, end, count }) => (
            <li key={to}>
              <NavLink to={to} end={end} className={item} onClick={onNavigate} title={show ? undefined : label}>
                <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.9} />
                {show && <span className="flex-1">{label}</span>}
                {show && count && (
                  <span className="rounded-md bg-brand-50 px-1.5 text-[11px] font-semibold text-brand-700 dark:bg-brand-500/15 dark:text-brand-400">{count}</span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
        {show && <p className="px-2.5 pb-2 pt-6 text-[11px] font-medium uppercase tracking-wider text-zinc-400">Workspace</p>}
        <ul className={`space-y-0.5 ${show ? '' : 'mt-4 border-t border-zinc-200 pt-4 dark:border-zinc-800'}`}>
          <li>
            <NavLink to="/settings" className={item} onClick={onNavigate} title={show ? undefined : 'Settings'}>
              <Settings className="h-[18px] w-[18px] shrink-0" strokeWidth={1.9} />
              {show && 'Settings'}
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="space-y-2 p-3">
        {show && (
          <a
            href="https://codemade.studio"
            target="_blank"
            rel="noopener"
            className="flex items-center justify-between rounded-lg border border-dashed border-zinc-300 px-3 py-2.5 text-xs text-zinc-500 transition hover:border-brand-500 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            <span>Concept project by <span className="font-semibold text-zinc-800 dark:text-zinc-200">Codemade Studio</span></span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        )}
        {!mobile && (
          <button
            type="button"
            onClick={onToggle}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={`flex h-9 w-full items-center gap-3 rounded-lg px-2.5 text-sm font-medium text-zinc-500 transition hover:bg-zinc-900/5 hover:text-zinc-900 dark:hover:bg-white/5 dark:hover:text-zinc-100 ${show ? '' : 'justify-center'}`}
          >
            {collapsed ? <PanelLeft className="h-[18px] w-[18px]" /> : <PanelLeftClose className="h-[18px] w-[18px]" />}
            {show && 'Collapse'}
          </button>
        )}
      </div>
    </div>
  )
}

function IconButton({ label, children, ...rest }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
      {...rest}
    >
      {children}
    </button>
  )
}

function Topbar({ onOpenNav }) {
  const { theme, toggle } = useTheme()
  const navigate = useNavigate()
  const [items, setItems] = useState(notifications)
  const unread = items.filter((n) => n.unread).length

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-zinc-200 bg-white/80 px-4 backdrop-blur-md sm:px-6 dark:border-zinc-800 dark:bg-zinc-950/80">
      <button type="button" onClick={onOpenNav} aria-label="Open menu" className="-ml-1 rounded-md p-1.5 text-zinc-600 hover:bg-zinc-100 lg:hidden dark:text-zinc-300 dark:hover:bg-zinc-800">
        <MenuIcon className="h-5 w-5" />
      </button>

      <form className="relative max-w-md flex-1" role="search" onSubmit={(e) => { e.preventDefault(); navigate('/customers') }}>
        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <input
          type="search"
          placeholder="Search…"
          aria-label="Search"
          className="h-9 w-full rounded-lg border border-zinc-200 bg-zinc-50 pr-12 pl-9 text-sm placeholder:text-zinc-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-3 focus:ring-brand-500/15 dark:border-zinc-800 dark:bg-zinc-900 dark:focus:bg-zinc-900"
        />
        <kbd className="pointer-events-none absolute top-1/2 right-2.5 hidden -translate-y-1/2 rounded border border-zinc-200 bg-white px-1.5 text-[11px] font-medium text-zinc-400 sm:block dark:border-zinc-700 dark:bg-zinc-800">⌘K</kbd>
      </form>

      <div className="ml-auto flex items-center gap-1">
        <IconButton label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} onClick={toggle}>
          {theme === 'dark' ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
        </IconButton>

        <Menu
          width="w-80"
          trigger={({ toggle: t }) => (
            <IconButton label={`Notifications (${unread} unread)`} onClick={t}>
              <Bell className="h-[18px] w-[18px]" />
              {unread > 0 && <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-brand-500 ring-2 ring-white dark:ring-zinc-950" />}
            </IconButton>
          )}
        >
          {() => (
            <div>
              <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
                <p className="text-sm font-semibold">Notifications</p>
                <button type="button" className="text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400" onClick={() => setItems(items.map((n) => ({ ...n, unread: false })))}>
                  Mark all as read
                </button>
              </div>
              <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {items.map((n) => (
                  <li key={n.id} className="flex gap-3 px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                    <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.unread ? 'bg-brand-500' : 'bg-transparent'}`} />
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium">{n.title}</p>
                      <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{n.body}</p>
                      <p className="mt-1 text-[11px] text-zinc-400">{n.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Menu>

        <Menu
          trigger={({ toggle: t, open }) => (
            <button type="button" onClick={t} aria-expanded={open} aria-label="Account menu" className="ml-1 flex items-center gap-2 rounded-full p-0.5 transition hover:ring-4 hover:ring-zinc-100 dark:hover:ring-zinc-800">
              <Avatar initials="HO" color="bg-emerald-600" />
            </button>
          )}
        >
          {(close) => (
            <div>
              <div className="border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
                <p className="text-sm font-semibold">Hannah Okafor</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">hannah@haldencoffee.co</p>
              </div>
              <ul className="p-1.5 text-sm">
                {[
                  { label: 'Profile', icon: User, to: '/settings' },
                  { label: 'Billing', icon: CreditCard, to: '/settings?tab=billing' },
                  { label: 'Settings', icon: Settings, to: '/settings' },
                ].map(({ label, icon: I, to }) => (
                  <li key={label}>
                    <button type="button" onClick={() => { close(); navigate(to) }} className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800">
                      <I className="h-4 w-4 text-zinc-400" />{label}
                    </button>
                  </li>
                ))}
                <li className="mt-1 border-t border-zinc-100 pt-1 dark:border-zinc-800">
                  <button type="button" onClick={() => { close(); navigate('/login') }} className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800">
                    <LogOut className="h-4 w-4 text-zinc-400" />Log out
                  </button>
                </li>
              </ul>
            </div>
          )}
        </Menu>
      </div>
    </header>
  )
}

export default function Layout() {
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('mosswell-collapsed') === '1')
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => { localStorage.setItem('mosswell-collapsed', collapsed ? '1' : '0') }, [collapsed])
  useEffect(() => { window.scrollTo(0, 0) }, [location.pathname])

  return (
    <div className="flex min-h-screen">
      <aside className={`hidden shrink-0 border-r border-zinc-200 bg-zinc-50 transition-[width] duration-200 lg:block dark:border-zinc-800 dark:bg-zinc-950 ${collapsed ? 'w-[68px]' : 'w-64'}`}>
        <div className="sticky top-0 h-screen">
          <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-zinc-950/40 dark:bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="relative h-full w-72 border-r border-zinc-200 bg-zinc-50 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
            <Sidebar mobile onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenNav={() => setMobileOpen(true)} />
        <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
