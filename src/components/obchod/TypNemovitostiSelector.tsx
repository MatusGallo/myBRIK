import { Home, Building, MapPin, Building2, Warehouse, type LucideIcon } from 'lucide-react'

export interface TypNemovitostiOption {
  value: string
  label: string
  Icon: LucideIcon
}

export const TYP_NEMOVITOSTI_OPTS: TypNemovitostiOption[] = [
  { value: 'dum',      label: 'Dům',      Icon: Home },
  { value: 'byt',      label: 'Byt',      Icon: Building },
  { value: 'pozemek',  label: 'Pozemek',  Icon: MapPin },
  { value: 'komercni', label: 'Komerční', Icon: Building2 },
  { value: 'ostatni',  label: 'Ostatní',  Icon: Warehouse },
]

interface Props {
  value: string
  onChange: (value: string) => void
  options?: TypNemovitostiOption[]
  error?: boolean
}

export default function TypNemovitostiSelector({ value, onChange, options = TYP_NEMOVITOSTI_OPTS, error }: Props) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))`, gap: 10 }}>
      {options.map(({ value: v, label, Icon }) => {
        const active = value === v
        const showError = error && !active
        return (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              padding: '12px 20px',
              borderRadius: 8,
              border: `2px solid ${active ? 'var(--t-borderMyDOCK)' : showError ? 'var(--t-borderDangerPrimary, #DC2626)' : 'var(--t-borderPrimary)'}`,
              background: active ? 'var(--t-bgMyDOCKTertiary)' : 'var(--t-bgPrimary)',
              color: active ? 'var(--t-textMyDOCKPrimary)' : 'var(--t-textSecondary)',
              fontSize: 13,
              fontWeight: active ? 600 : 400,
              cursor: 'pointer',
              minWidth: 0,
              transition: 'border-color 0.15s, background 0.15s, color 0.15s',
            }}
          >
            <Icon size={22} />
            <span>{label}</span>
          </button>
        )
      })}
    </div>
  )
}
