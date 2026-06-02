import { Form, IconButton } from '@matusgallo/mysabds'
import { User, Clock, X } from 'lucide-react'
import type { UzivatelData } from './UzivatelPanel'
import { getUzivatelHistorie } from '../../data/mockOstatni'

interface Props {
  uzivatel: UzivatelData
  onClose: () => void
}

export default function UzivatelHistoriePanel({ uzivatel, onClose }: Props) {
  const history = getUzivatelHistorie(uzivatel.id as number)

  return (
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
            { label: 'Zavřít', variant: 'outlined', onClick: onClose },
          ],
        }}
      >
        <div style={{ position: 'sticky', top: 0, zIndex: 1, padding: 24, background: 'var(--t-bgSecondary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 14, fontWeight: 600, lineHeight: '20px', color: 'var(--t-textSecondary)', fontFamily: 'Inter' }}>{`${uzivatel.jmeno} ${uzivatel.prijmeni}`.trim()}</span>
            <span style={{ fontSize: 24, fontWeight: 600, lineHeight: '32px', color: 'var(--t-textPrimary)', fontFamily: 'Inter' }}>Historie změn</span>
          </div>
          <IconButton icon={X} variant="ghost" size="md" onClick={onClose} />
        </div>
        <div style={{ padding: '0 24px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {history.map((entry) => {
            const [date, time] = entry.datum.split(' ')
            return (
              <div key={entry.id} style={{
                background: 'var(--t-bgPrimary)',
                border: '1px solid var(--t-borderPrimary)',
                borderRadius: 8,
                padding: '14px 16px',
                display: 'flex', flexDirection: 'column', gap: 10,
              }}>

                {/* Header: date+time left, user right */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--t-textPrimary)' }}>{date}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--t-textSecondary)' }}>
                      <Clock size={12} />
                      <span style={{ fontSize: 12 }}>{time}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--t-textSecondary)' }}>
                    <User size={12} />
                    <span>{entry.zmenil}</span>
                  </div>
                </div>

                {/* Divider */}
                <div style={{ height: 1, background: 'var(--t-borderPrimary)', margin: '0 -16px' }} />

                {/* Changed fields */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {entry.pole.map((pole, i) => (
                    <span key={i} style={{
                      fontSize: 12, fontWeight: 500,
                      color: 'var(--t-textPrimary)',
                      background: 'var(--t-bgSecondary)',
                      border: '1px solid var(--t-borderPrimary)',
                      borderRadius: 4, padding: '3px 10px',
                    }}>
                      {pole}
                    </span>
                  ))}
                </div>

              </div>
            )
          })}
        </div>
      </Form>
    </div>
  )
}
