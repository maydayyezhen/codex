import type { ReactNode } from 'react'
import { PageHeader } from './PageHeader'

interface PageShellProps {
  path: string
  title: string
  children: ReactNode
  bodyClassName?: string
}

export function PageShell({ path, title, children, bodyClassName = '' }: PageShellProps) {
  return (
    <section className="page-shell">
      <PageHeader path={path} title={title} />
      <div className={`page-shell__body ${bodyClassName}`.trim()}>{children}</div>
    </section>
  )
}
