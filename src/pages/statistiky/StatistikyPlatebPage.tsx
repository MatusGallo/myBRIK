import { useState } from 'react'
import ListPageShell from '../../components/shared/ListPageShell'
import DataTable from '../../components/shared/DataTable'
import PageFilterBar from '../../components/shared/PageFilterBar'
import { pobockyData, makleriList } from '../../data/mockOstatni'
import { renderAvatarName } from '../../utils/renderAvatarName'

const POBOCKY = pobockyData.map(p => p.nazev)
const DRUHY_PLATBY = ['Rezervační poplatek', 'Záloha', 'Doplatek kupní ceny', 'Provize', 'Smluvní pokuta']
const ZPUSOBY_PLATBY = ['Převodem', 'Hotovost', 'Kartou']

const cols = [
  { key: 'id', label: 'ID', width: 60 },
  { key: 'nabidka', label: 'Nabídka', width: 240 },
  { key: 'datum', label: 'Datum', width: 140 },
  { key: 'pobocka', label: 'Pobočka', width: 160 },
  { key: 'makler', label: 'Makléř', width: 220, render: renderAvatarName('makler') },
  { key: 'vysePlatby', label: 'Výše platby', width: 130, align: 'right' as const },
  { key: 'zpusobPlatby', label: 'Způsob platby', width: 140 },
  { key: 'druhPlatby', label: 'Druh platby', width: 140 },
  { key: 'firma', label: 'Firma', width: 160 },
]

export default function StatistikyPlatebPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [pobocka, setPobocka] = useState(new Set<string>())
  const [makler, setMakler] = useState(new Set<string>())
  const [druhPlatby, setDruhPlatby] = useState(new Set<string>())
  const [zpusobPlatby, setZpusobPlatby] = useState(new Set<string>())
  const [nabidka, setNabidka] = useState('')
  const [datum, setDatum] = useState('')

  const toggle = (setter: React.Dispatch<React.SetStateAction<Set<string>>>) => (v: string) =>
    setter(prev => { const next = new Set(prev); next.has(v) ? next.delete(v) : next.add(v); return next })

  return (
    <ListPageShell
      title="Statistiky plateb"
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
            { label: 'Druh platby', options: DRUHY_PLATBY, values: druhPlatby, onChange: toggle(setDruhPlatby) },
            { label: 'Způsob platby', options: ZPUSOBY_PLATBY, values: zpusobPlatby, onChange: toggle(setZpusobPlatby) },
          ]}
          fields={[
            { label: 'Nabídka', value: nabidka, onChange: setNabidka },
            { label: 'Datum', type: 'date', value: datum, onChange: setDatum },
          ]}
onClear={() => {
            setSearch(''); setPobocka(new Set()); setMakler(new Set())
            setDruhPlatby(new Set()); setZpusobPlatby(new Set())
            setNabidka(''); setDatum(''); setPage(1)
          }}
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
