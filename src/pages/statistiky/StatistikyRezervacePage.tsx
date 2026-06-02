import { useState } from 'react'
import ListPageShell from '../../components/shared/ListPageShell'
import DataTable from '../../components/shared/DataTable'
import PageFilterBar from '../../components/shared/PageFilterBar'
import { pobockyData, makleriList } from '../../data/mockOstatni'
import { renderAvatarName } from '../../utils/renderAvatarName'

const POBOCKY = pobockyData.map(p => p.nazev)

const cols = [
  { key: 'id', label: 'ID', width: 60 },
  { key: 'nabidka', label: 'Nabídka', width: 240 },
  { key: 'pobocka', label: 'Pobočka', width: 160 },
  { key: 'makler', label: 'Makléř', width: 220, render: renderAvatarName('makler') },
  { key: 'rezervacniPoplatek', label: 'Rezervační poplatek', width: 160, align: 'right' as const },
  { key: 'uhrazeno', label: 'Uhrazeno', width: 120, align: 'right' as const },
  { key: 'nedoplatek', label: 'Nedoplatek', width: 120, align: 'right' as const },
  { key: 'splatnost', label: 'Splatnost', width: 130 },
  { key: 'platnostSmlouvy', label: 'Platnost smlouvy', width: 140 },
  { key: 'firma', label: 'Firma', width: 160 },
]

export default function StatistikyRezervacePage() {
  const [page, setPage] = useState(1)
  const [pobocka, setPobocka] = useState(new Set<string>())
  const [makler, setMakler] = useState(new Set<string>())
  const [nedoplatek, setNedoplatek] = useState(new Set<string>())
  const [search, setSearch] = useState('')
  const [nabidka, setNabidka] = useState('')

  const toggle = (setter: React.Dispatch<React.SetStateAction<Set<string>>>) => (v: string) =>
    setter(prev => { const next = new Set(prev); next.has(v) ? next.delete(v) : next.add(v); return next })

  return (
    <ListPageShell
      title="Statistiky"
      subtitle="aktualizováno v 09:00:01 a další aktualizace proběhne v 10:00:01"
      actions={[
        { label: 'Export', variant: 'export', icon: 'download' },
      ]}
      filterBar={
        <PageFilterBar
          search={{ value: search, onChange: setSearch, placeholder: 'Hledat...' }}
          groups={[
            { label: 'Pobočka', options: POBOCKY, values: pobocka, onChange: toggle(setPobocka), searchable: true },
            { label: 'Makléř', options: makleriList, values: makler, onChange: toggle(setMakler), searchable: true },
            { label: 'Nedoplatek', options: ['Ano', 'Ne'], values: nedoplatek, onChange: toggle(setNedoplatek) },
          ]}
          fields={[
            { label: 'Nabídka', value: nabidka, onChange: setNabidka },
          ]}
onClear={() => { setSearch(''); setPobocka(new Set()); setMakler(new Set()); setNedoplatek(new Set()); setNabidka(''); setPage(1) }}
        />
      }
      page={page}
      totalPages={1}
      onPageChange={setPage}
      totalCount={0}
    >
      <DataTable cols={cols} rows={[]} actions={['view', 'edit', 'delete']} />
    </ListPageShell>
  )
}
