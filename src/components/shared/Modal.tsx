import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { IconButton, Button } from '@matusgallo/mysabds'

export interface ModalAction {
  label: string
  variant?: 'primary' | 'soft' | 'outlined' | 'neutral' | 'ghost'
  onClick?: () => void
}

interface Props {
  title: string
  onClose: () => void
  actions?: ModalAction[]
  children: ReactNode
  width?: 480 | 720
}

export default function Modal({ title, onClose, actions = [], children, width = 720 }: Props) {
  return createPortal(
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(10,13,18,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--bg-primary, #fff)',
          borderRadius: 16,
          boxShadow: '0px 2px 4px -2px rgba(10,13,18,0.06), 0px 4px 6px -1px rgba(10,13,18,0.10)',
          width,
          maxWidth: 'calc(100vw - 32px)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header — bez borderBottom */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 24,
          gap: 24,
        }}>
          <span style={{
            flex: 1,
            fontSize: 20,
            fontWeight: 600,
            fontFamily: 'Inter',
            lineHeight: '28px',
            color: 'var(--text-primary, #2C2E30)',
          }}>
            {title}
          </span>
          <IconButton icon={X} variant="ghost" size="md" onClick={onClose} />
        </div>

        {/* Body — bez top paddingu */}
        <div style={{ padding: '0 24px 24px' }}>
          {children}
        </div>

        {/* Divider */}
        {actions.length > 0 && (
          <div style={{ height: 0, borderTop: '1px solid var(--border-primary, #E7E8E9)' }} />
        )}

        {/* Footer — biely, padding 12px 24px */}
        {actions.length > 0 && (
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: 8,
            padding: '12px 24px',
          }}>
            {actions.map((a, i) => (
              <Button key={i} label={a.label} variant={a.variant ?? 'outlined'} onClick={a.onClick} />
            ))}
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}
