interface PageHeaderProps {
  path: string
  title: string
}

export function PageHeader({ path, title }: PageHeaderProps) {
  return (
    <header className="page-header">
      <div className="page-header__path">{path}</div>
      <h1 className="page-header__title">{title}</h1>
    </header>
  )
}
