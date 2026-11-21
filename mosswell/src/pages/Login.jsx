import { useNavigate } from 'react-router'
import { ArrowUpRight } from 'lucide-react'
import { LogoMark } from '../components/Logo.jsx'
import { Field, inputClass } from '../components/ui.jsx'

export default function Login() {
  const navigate = useNavigate()
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col px-6 py-8 sm:px-12">
        <div className="flex items-center gap-2.5">
          <LogoMark />
          <span className="text-[15px] font-semibold tracking-tight">Mosswell</span>
        </div>
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Sign in to your store dashboard.</p>
          <form className="mt-8 space-y-5" onSubmit={(e) => { e.preventDefault(); navigate('/') }}>
            <Field label="Email"><input type="email" className={inputClass} defaultValue="hannah@haldencoffee.co" /></Field>
            <Field label="Password"><input type="password" className={inputClass} defaultValue="demo-password" /></Field>
            <div className="flex items-center justify-between text-[13px]">
              <label className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300"><input type="checkbox" defaultChecked className="h-4 w-4 accent-emerald-600" />Remember me</label>
              <a href="#" className="font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400">Forgot password?</a>
            </div>
            <button type="submit" className="h-10 w-full rounded-lg bg-brand-600 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 dark:bg-brand-500 dark:text-zinc-950 dark:hover:bg-brand-400">
              Sign in
            </button>
          </form>
          <p className="mt-6 rounded-lg bg-zinc-100 px-3 py-2.5 text-center text-xs text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
            Demo only — no real account needed. Just press Sign in.
          </p>
        </div>
        <a href="https://codemade.studio" target="_blank" rel="noopener" className="inline-flex items-center gap-1 self-start text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">
          Concept project by <span className="font-semibold">Codemade Studio</span><ArrowUpRight className="h-3 w-3" />
        </a>
      </div>
      <div className="hidden bg-gradient-to-br from-emerald-600 to-teal-800 p-12 lg:flex lg:flex-col lg:justify-end">
        <blockquote className="max-w-md text-white">
          <p className="text-2xl font-medium leading-snug">“Mosswell replaced four spreadsheets and a Monday meeting. I know how the store is doing before my first coffee.”</p>
          <footer className="mt-6 text-sm text-emerald-100">Hannah Okafor · Founder, Halden Coffee Co.</footer>
        </blockquote>
      </div>
    </div>
  )
}
