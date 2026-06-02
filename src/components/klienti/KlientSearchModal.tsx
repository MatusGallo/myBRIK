import { useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { Button, IconButton, RadioGroupItem, Search } from '@matusgallo/mysabds'

type AvatarColor = 'dark' | 'purple' | 'blue' | 'orange' | 'green' | 'teal'
import { klientiData } from '../../data/mockOstatni'
import type { KlientData } from './KlientPanel'

interface Props {
  onSelect: (klient: KlientData) => void
  onClose: () => void
}

const AVATAR_COLORS: AvatarColor[] = ['blue', 'purple', 'green', 'teal', 'orange']

function avatarColor(id: number): AvatarColor {
  return AVATAR_COLORS[id % AVATAR_COLORS.length]
}

function initials(jmeno: string, prijmeni: string) {
  return `${jmeno.charAt(0)}${prijmeni.charAt(0)}`.toUpperCase()
}

export default function KlientSearchModal({ onSelect, onClose }: Props) {
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const filtered = search
    ? klientiData.filter(k =>
        [k.jmeno, k.prijmeni, k.email, k.telefon].some(v =>
          v.toLowerCase().includes(search.toLowerCase())
        )
      )
    : klientiData

  const selectedKlient = filtered.find(k => k.id === selectedId) ?? null

  function handleConfirm() {
    if (!selectedKlient) return
    onSelect(selectedKlient)
    onClose()
  }

  return createPortal(
    <>
      <div
        style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(10,13,18,0.4)' }}
        onClick={onClose}
      />

      <div style={{
        position: 'fixed', inset: 0, zIndex: 201,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none',
      }}>
        <div style={{
          pointerEvents: 'auto',
          background: 'var(--t-bgPrimary)',
          borderRadius: 16,
          width: 720,
          maxWidth: 720,
          maxHeight: 720,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(10,13,18,0.2)',
        }}>

          {/* Header */}
          <div style={{ padding: '20px 24px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <span style={{ fontSize: 18, fontWeight: 600, color: 'var(--t-textPrimary)', lineHeight: '32px' }}>
              Vyhledat klienta
            </span>
            <IconButton icon={X} variant="ghost" size="md" onClick={onClose} />
          </div>

          {/* Search */}
          <div style={{ padding: '0 24px 16px', flexShrink: 0 }}>
            <Search
              value={search}
              onChange={setSearch}
              placeholder="Vyhledejte klienta podle jména, telefonu nebo e-mailu"
              width="100%"
            />
          </div>

          {/* Cards */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '2px 24px' }}>
            {filtered.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--t-textSecondary)', padding: '20px 0', fontSize: 14, margin: 0 }}>
                Žádní klienti neodpovídají hledání
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingBottom: 8 }}>
                {filtered.map(k => (
                  <div
                    key={k.id}
                    style={{
                      borderRadius: 12,
                      outline: k.id === selectedId ? '2px solid var(--t-borderMyDOCK)' : '2px solid transparent',
                      outlineOffset: '-2px',
                    }}
                  >
                    <RadioGroupItem
                      label={`${k.jmeno} ${k.prijmeni}`}
                      supportText={`ID ${k.id}`}
                      description={`${k.telefon} · ${k.email}`}
                      checked={k.id === selectedId}
                      onChange={() => setSelectedId(k.id)}
                      leadAvatarInitials={initials(k.jmeno, k.prijmeni)}
                      leadAvatarColor={avatarColor(k.id)}
                      width="100%"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8, borderTop: '1px solid var(--t-borderPrimary)', flexShrink: 0 }}>
            <Button label="Zrušit" variant="outlined" onClick={onClose} />
            <Button label="Potvrdit výběr" variant="primary" disabled={!selectedKlient} onClick={handleConfirm} />
          </div>

        </div>
      </div>
    </>,
    document.body
  )
}
