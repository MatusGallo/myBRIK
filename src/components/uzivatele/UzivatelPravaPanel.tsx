import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { Form, CheckboxItem, Divider, IconButton } from '@matusgallo/mysabds'
import { X } from 'lucide-react'
import { PERM_MODULES, PermRow, type Perms } from '../role/RolePanel'
import ConfirmDialog from '../shared/ConfirmDialog'
import type { UzivatelData } from './UzivatelPanel'

interface Props {
  uzivatel: UzivatelData
  onClose: () => void
}

export default function UzivatelPravaPanel({ uzivatel, onClose }: Props) {
  const [perms, setPerms] = useState<Perms>({})
  const [showDiscard, setShowDiscard] = useState(false)

  const setPerm = (k: string, v: boolean) => setPerms(prev => ({ ...prev, [k]: v }))

  function handleClose() {
    setShowDiscard(true)
  }

  return (
    <>
      {createPortal(
        <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={handleClose} />,
        document.body
      )}

      <div style={{
        position: 'fixed', right: 0, top: 56, bottom: 0, width: 800, zIndex: 100,
        boxShadow: '-2px 0 4px -2px #0a0d120f, -4px 0 6px -1px #0a0d121a',
        clipPath: 'inset(0 0 0 -20px)',
      }}>
        <Form
          width={800 as never}
          minHeight={0}
          footer={{
            actions: [
              { label: 'Zrušit', variant: 'outlined', onClick: handleClose },
              { label: 'Uložit', variant: 'primary', onClick: onClose },
            ],
          }}
        >
          <div style={{ position: 'sticky', top: 0, zIndex: 1, padding: 24, background: 'var(--t-bgSecondary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 14, fontWeight: 600, lineHeight: '20px', color: 'var(--t-textSecondary)', fontFamily: 'Inter' }}>Individuální nastavení práv</span>
              <span style={{ fontSize: 24, fontWeight: 600, lineHeight: '32px', color: 'var(--t-textPrimary)', fontFamily: 'Inter' }}>
                {`${uzivatel.jmeno} ${uzivatel.prijmeni}`.trim()}
              </span>
            </div>
            <IconButton icon={X} variant="ghost" size="md" onClick={handleClose} />
          </div>
          <div style={{ padding: '0 24px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>

            <div style={{
              background: 'var(--t-bgPrimary)', border: '1px solid var(--t-borderPrimary)',
              borderRadius: 12, padding: 16,
              display: 'flex', flexDirection: 'column', gap: 12,
            }}>
              <span style={{ fontSize: 18, fontWeight: 600, color: 'var(--t-textPrimary)', lineHeight: '32px', height: 32 }}>Nastavení</span>
              <CheckboxItem
                label="Přepsat práva role"
                description="Individuální práva tohoto uživatele přepíší práva přiřazené role."
                checked={false}
                onChange={() => {}}
              />
            </div>

            {PERM_MODULES.map(mod => (
              <div key={mod.id} style={{
                background: 'var(--t-bgPrimary)', border: '1px solid var(--t-borderPrimary)',
                borderRadius: 12, padding: 16,
                display: 'flex', flexDirection: 'column', gap: 16,
              }}>
                <span style={{ fontSize: 18, fontWeight: 600, color: 'var(--t-textPrimary)', lineHeight: '32px', height: 32 }}>{mod.title}</span>
                {mod.groups.map((grp, gi) => (
                  <React.Fragment key={gi}>
                    {gi > 0 && <Divider />}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {grp.title && (
                        <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--t-textPrimary)', margin: 0, lineHeight: '20px' }}>{grp.title}</p>
                      )}
                      {grp.description && (
                        <p style={{ fontSize: 13, color: 'var(--t-textSecondary)', lineHeight: '18px', margin: 0 }}>{grp.description}</p>
                      )}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px 12px' }}>
                        {grp.items.map(item => (
                          <PermRow key={item.key} label={item.label} pKey={item.key} perms={perms} onChange={setPerm} />
                        ))}
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            ))}
          </div>
        </Form>
      </div>

      {showDiscard && (
        <ConfirmDialog
          title="Zahodit změny?"
          description="Máte neuložené změny. Chcete je zahodit, nebo pokračovat v úpravách?"
          primaryLabel="Zrušit"
          secondaryLabel="Pokračovat v úpravách"
          destructive
          onPrimary={onClose}
          onSecondary={() => setShowDiscard(false)}
        />
      )}
    </>
  )
}
