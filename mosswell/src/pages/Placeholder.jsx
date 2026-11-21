import { Link } from 'react-router'
import { Sprout } from 'lucide-react'
import { Card, PageHeader } from '../components/ui.jsx'

export default function Placeholder({ title }) {
  return (
    <div className="space-y-6">
      <PageHeader title={title} />
      <Card className="flex flex-col items-center px-6 py-20 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400"><Sprout className="h-6 w-6" /></span>
        <h2 className="mt-4 font-semibold">{title} is growing</h2>
        <p className="mt-1 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">This page isn’t part of the concept demo yet. Try the Overview, Customers, Orders, or Settings pages.</p>
        <Link to="/" className="mt-5 text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400">Back to overview →</Link>
      </Card>
    </div>
  )
}
