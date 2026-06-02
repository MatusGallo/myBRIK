const osobniUdaje = [
  { label: 'Jméno', value: 'Tomáš' },
  { label: 'Příjmení', value: 'Novák' },
  { label: 'Osobní e-mail', value: 'tomas.novak@email.cz' },
  { label: 'Firemní e-mail', value: 'tomas.novak@blogic.cz' },
  { label: 'Telefon', value: '+420 731 456 789' },
  { label: 'Datum narození', value: '15.03.1988' },
  { label: 'Rodné číslo', value: '880315/3214' },
  { label: 'Číslo občanského průkazu', value: 'AB123456' },
  { label: 'Typ osoby', value: 'Fyzická osoba' },
  { label: 'HPP', value: 'Ano' },
  { label: 'Neplátce DPH', value: 'Ano' },
  { label: 'Plátce DPH', value: 'Ne' },
]

const trvaleBydliste = [
  { label: 'Ulice', value: 'Nová' },
  { label: 'Číslo popisné', value: '7821' },
  { label: 'Číslo orientační', value: '' },
  { label: 'Město', value: 'Praha' },
  { label: 'PSČ', value: '123 12' },
]

const fakturacniUdaje = [
  { label: 'Obchodní název', value: 'Novák Consulting s.r.o.' },
  { label: 'IČ', value: '08541236' },
  { label: 'DIČ', value: 'CZ08541236' },
  { label: 'Ulice', value: 'Nová' },
  { label: 'Číslo popisné', value: '7821' },
  { label: 'Číslo orientační', value: '4' },
  { label: 'Město', value: 'Praha' },
  { label: 'PSČ', value: '123 12' },
]

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontSize: 16,
        fontWeight: 600,
        lineHeight: '24px',
        color: 'var(--t-textPrimary)',
        margin: '0 0 12px',
      }}
    >
      {children}
    </h2>
  )
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 24,
        gap: 24,
      }}
    >
      <span
        style={{
          fontSize: 14,
          fontWeight: 400,
          lineHeight: '20px',
          color: 'var(--t-textSecondary)',
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 14,
          fontWeight: 500,
          lineHeight: '20px',
          color: 'var(--t-textPrimary)',
          textAlign: 'right',
        }}
      >
        {value || '—'}
      </span>
    </div>
  )
}

function Section({ title, rows }: { title: string; rows: { label: string; value: string }[] }) {
  return (
    <section>
      <SectionHeading>{title}</SectionHeading>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {rows.map(row => (
          <DataRow key={row.label} label={row.label} value={row.value} />
        ))}
      </div>
    </section>
  )
}

export default function ProfilPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: 24 }}>
      <h1
        style={{
          fontSize: 20,
          fontWeight: 600,
          lineHeight: '28px',
          color: 'var(--t-textPrimary)',
          margin: 0,
        }}
      >
        Profil
      </h1>

      <Section title="Osobní údaje" rows={osobniUdaje} />

      <div style={{ height: 1, background: 'var(--t-borderPrimary)' }} />

      <Section title="Trvalé bydliště" rows={trvaleBydliste} />

      <div style={{ height: 1, background: 'var(--t-borderPrimary)' }} />

      <Section title="Fakturační údaje neplátce DPH" rows={fakturacniUdaje} />
    </div>
  )
}
