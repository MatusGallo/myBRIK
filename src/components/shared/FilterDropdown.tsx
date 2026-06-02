import type { ReactNode, CSSProperties } from 'react'

export function DropdownPanel({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 'calc(100% + 4px)',
        left: 0,
        zIndex: 100,
        background: 'var(--t-bgPrimary)',
        border: '1px solid var(--t-borderPrimary)',
        borderRadius: 8,
        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
        padding: '4px 0',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export function DateField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--t-textTertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
        {label}
      </p>
      <input
        type="date"
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ width: '100%', height: 36, padding: '0 12px', borderRadius: 6, border: '1px solid var(--t-borderPrimary)', background: 'var(--t-bgPrimary)', color: 'var(--t-textPrimary)', fontSize: 13, boxSizing: 'border-box' }}
      />
    </div>
  )
}

export function TextInputField({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--t-textTertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
        {label}
      </p>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ width: '100%', height: 36, padding: '0 12px', borderRadius: 6, border: '1px solid var(--t-borderPrimary)', background: 'var(--t-bgPrimary)', color: 'var(--t-textPrimary)', fontSize: 13, boxSizing: 'border-box' }}
      />
    </div>
  )
}
