import { PackageOpen, SearchX } from 'lucide-react'
import { Button } from '@matusgallo/mysabds'

interface EmptyStateProps {
  variant?: 'default' | 'search'
  title?: string
  description?: string
  cta?: { label: string; onClick: () => void }
}

const DEFAULTS = {
  default: {
    title: 'Zatím zde nemáte žádné položky',
    description: 'Vytvořte první položku a zobrazí se v tomto seznamu.',
    Icon: PackageOpen,
  },
  search: {
    title: 'Nebyly nalezeny žádné položky',
    description: 'Vašemu výběru neodpovídají žádné položky.',
    Icon: SearchX,
  },
}

export default function EmptyState({ variant = 'default', title, description, cta }: EmptyStateProps) {
  const { title: defaultTitle, description: defaultDesc, Icon } = DEFAULTS[variant]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '56px 24px', textAlign: 'center' }}>
      <div style={{ color: 'var(--t-textTertiary)' }}>
        <Icon size={40} strokeWidth={1.5} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxWidth: 340 }}>
        <div style={{ fontSize: 16, fontWeight: 600, lineHeight: '24px', color: 'var(--t-textPrimary)' }}>
          {title ?? defaultTitle}
        </div>
        <div style={{ fontSize: 14, lineHeight: '20px', color: 'var(--t-textSecondary)' }}>
          {description ?? defaultDesc}
        </div>
      </div>
      {cta && <Button label={cta.label} variant="primary" onClick={cta.onClick} />}
    </div>
  )
}
