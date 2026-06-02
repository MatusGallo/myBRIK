import { useState } from 'react'
import { Home, MessageCircle, Users, TrendingUp, FileText, Activity, CreditCard } from 'lucide-react'
import { LineTabGroup } from '@matusgallo/mysabds'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

const months = ['Čer', 'Čvc', 'Srp', 'Zář', 'Říj', 'Lis', 'Pro', 'Led', 'Úno', 'Bře', 'Dub', 'Kvě']
const payoutData = months.map(m => ({ month: m, aktualni: 0, minuly: 0 }))
const performanceData = months.map(m => ({ month: m, poptavky: 0, nabidky: 0 }))

const kpiCards = [
  { label: 'Nabídky', value: '0', icon: Home, delta: null },
  { label: 'Klienti', value: '2 625', icon: Users, delta: null },
  { label: 'Příležitosti', value: '1 186', icon: TrendingUp, delta: null },
  { label: 'Poptávky', value: '0', icon: MessageCircle, delta: null },
]

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: 'var(--t-bgPrimary)',
      borderRadius: 12,
      border: '1px solid var(--t-borderPrimary)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid var(--t-borderPrimary)',
        fontSize: 14,
        fontWeight: 600,
        lineHeight: '20px',
        color: 'var(--t-textPrimary)',
      }}>
        {title}
      </div>
      <div style={{ flex: 1 }}>
        {children}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [contractTab, setContractTab] = useState(0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Page title */}
      <h1 style={{ fontSize: 24, fontWeight: 600, lineHeight: '32px', color: 'var(--t-textPrimary)', margin: 0 }}>
        Přehled
      </h1>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {kpiCards.map(card => {
          const Icon = card.icon
          return (
            <div key={card.label} style={{
              background: 'var(--t-bgPrimary)',
              border: '1px solid var(--t-borderPrimary)',
              borderRadius: 12,
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--t-textSecondary)', lineHeight: '18px' }}>
                  {card.label}
                </span>
                <div style={{
                  width: 32, height: 32,
                  borderRadius: 8,
                  background: 'var(--t-bgSecondary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={16} style={{ color: 'var(--t-textMyDOCKPrimary)' }} />
                </div>
              </div>
              <span style={{ fontSize: 28, fontWeight: 700, lineHeight: '36px', color: 'var(--t-textPrimary)' }}>
                {card.value}
              </span>
            </div>
          )
        })}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* Moje výplata */}
        <SectionCard title="Moje výplata">
          <div style={{ padding: '16px 20px 8px' }}>
            <div style={{ marginBottom: 16 }}>
              <span style={{ fontSize: 28, fontWeight: 700, color: 'var(--t-textPrimary)' }}>0 Kč</span>
              <p style={{ fontSize: 12, color: 'var(--t-textSecondary)', margin: '2px 0 0' }}>Aktuální výplata</p>
            </div>
            <ResponsiveContainer width="100%" height={140}>
              <LineChart data={payoutData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--t-borderPrimary)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--t-textTertiary)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--t-textTertiary)' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid var(--t-borderPrimary)', background: 'var(--t-bgPrimary)' }}
                  formatter={(v: number) => [`${v.toLocaleString('cs-CZ')} Kč`]}
                  labelStyle={{ color: 'var(--t-textSecondary)' }}
                />
                <Line type="monotone" dataKey="aktualni" stroke="var(--t-textMyDOCKPrimary)" dot={false} strokeWidth={2} name="Aktuální" />
                <Line type="monotone" dataKey="minuly" stroke="var(--t-borderPrimary)" dot={false} strokeWidth={2} name="Minulý" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        {/* Výkon */}
        <SectionCard title="Výkon">
          <div style={{ padding: '16px 20px 8px' }}>
            <div style={{ display: 'flex', gap: 24, marginBottom: 16 }}>
              <div>
                <span style={{ fontSize: 13, color: 'var(--t-textSecondary)' }}>Poptávky</span>
                <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--t-textPrimary)' }}>0</div>
              </div>
              <div>
                <span style={{ fontSize: 13, color: 'var(--t-textSecondary)' }}>Nabídky</span>
                <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--t-textPrimary)' }}>0</div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={140}>
              <LineChart data={performanceData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--t-borderPrimary)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--t-textTertiary)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--t-textTertiary)' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid var(--t-borderPrimary)', background: 'var(--t-bgPrimary)' }}
                  labelStyle={{ color: 'var(--t-textSecondary)' }}
                />
                <Line type="monotone" dataKey="poptavky" stroke="var(--t-textMyDOCKPrimary)" dot={false} strokeWidth={2} name="Poptávky" />
                <Line type="monotone" dataKey="nabidky" stroke="#94a3b8" dot={false} strokeWidth={2} name="Nabídky" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>

        {/* Platnost smluv */}
        <SectionCard title="Platnost smluv">
          <div style={{ padding: 16 }}>
            <LineTabGroup
              tabs={[{ value: 'platne', label: 'Platné' }, { value: 'expirovane', label: 'Expirované' }]}
              value={contractTab === 0 ? 'platne' : 'expirovane'}
              onChange={v => setContractTab(v === 'platne' ? 0 : 1)}
            />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 0', gap: 8 }}>
              <FileText size={28} style={{ color: 'var(--t-textTertiary)' }} />
              <span style={{ fontSize: 13, color: 'var(--t-textSecondary)' }}>Žádné smlouvy</span>
            </div>
          </div>
        </SectionCard>

        {/* K vyřízení */}
        <SectionCard title="K vyřízení">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 0', gap: 8 }}>
            <Activity size={28} style={{ color: 'var(--t-textTertiary)' }} />
            <span style={{ fontSize: 13, color: 'var(--t-textSecondary)' }}>Žádné záznamy</span>
          </div>
        </SectionCard>

        {/* Rychlé volby */}
        <SectionCard title="Rychlé volby">
          <div style={{ padding: 16, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {[
              { label: 'Nabídky', icon: Home, value: '0' },
              { label: 'Poptávky', icon: MessageCircle, value: '0' },
              { label: 'Klienti', icon: Users, value: '2 625' },
              { label: 'Příležitosti', icon: TrendingUp, value: '1 186' },
              { label: 'Výplata', icon: CreditCard, value: '0 Kč' },
              { label: 'Dokumenty', icon: FileText, value: '198' },
            ].map(item => {
              const Icon = item.icon
              return (
                <div key={item.label} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                  cursor: 'pointer', padding: '8px 4px', borderRadius: 8,
                  transition: 'background 0.15s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--t-bgSecondary)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: 8,
                    background: 'var(--t-bgSecondary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={18} style={{ color: 'var(--t-textMyDOCKPrimary)' }} />
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--t-textSecondary)', textAlign: 'center', lineHeight: '14px' }}>
                    {item.label}
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--t-textPrimary)' }}>
                    {item.value}
                  </span>
                </div>
              )
            })}
          </div>
        </SectionCard>

      </div>
    </div>
  )
}
