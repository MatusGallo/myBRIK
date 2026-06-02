import { useState } from 'react'
import ListPageShell from '../../components/shared/ListPageShell'
import DataTable from '../../components/shared/DataTable'
import PageFilterBar from '../../components/shared/PageFilterBar'
import { obchodData } from '../../data/mockObchod'
import { renderDatum } from '../../utils/tableRenders'
import { renderAvatarName } from '../../utils/renderAvatarName'
import { pobockyData, makleriList } from '../../data/mockOstatni'

const POBOCKY = pobockyData.map(p => p.nazev)
const PAGE_SIZE = 10

const cols = [
  { key: 'id', label: 'ID', width: 60 },
  { key: 'idTicketu', label: 'ID ticketu', width: 100 },
  { key: 'datumVytvoreni', label: 'Vytvořeno', width: 110, render: renderDatum('datumVytvoreni') },
  { key: 'pobocka', label: 'Pobočka', width: 200 },
  { key: 'makler', label: 'Makléř', width: 200, render: renderAvatarName('makler') },
  { key: 'klient', label: 'Klient', width: 200, render: renderAvatarName('klient') },
  { key: 'nabidkaId', label: 'Nabídka ID', width: 100 },
  { key: 'uver', label: 'Úvěr', width: 80 },
  { key: 'ucelKontaktu', label: 'Účel kontaktu', width: 170 },
  { key: 'stav', label: 'Stav', width: 180 },
]

export default function ObchodPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [pobocka, setPobocka] = useState(new Set<string>())
  const [makler, setMakler] = useState(new Set<string>())
  const [datumVytvoreni, setDatumVytvoreni] = useState('')
  const [datumZmeny, setDatumZmeny] = useState('')

  const toggle = (setter: React.Dispatch<React.SetStateAction<Set<string>>>) => (v: string) =>
    setter(prev => { const next = new Set(prev); next.has(v) ? next.delete(v) : next.add(v); return next })

  const pageData = obchodData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <ListPageShell
      title="Obchod"
      actions={[{ label: 'Přidat položku', variant: 'primary', icon: 'plus' }]}
      filterBar={
        <PageFilterBar
          search={{ value: search, onChange: setSearch, placeholder: 'Hledat dle ID ticketu...' }}
          groups={[
            { label: 'Pobočka', options: POBOCKY, values: pobocka, onChange: toggle(setPobocka), searchable: true },
            { label: 'Makléř', options: makleriList, values: makler, onChange: toggle(setMakler), searchable: true },
          ]}
          fields={[
            { label: 'Datum vytvoření', type: 'date', value: datumVytvoreni, onChange: setDatumVytvoreni },
            { label: 'Datum poslední změny', type: 'date', value: datumZmeny, onChange: setDatumZmeny },
          ]}
          onClear={() => { setSearch(''); setPobocka(new Set()); setMakler(new Set()); setDatumVytvoreni(''); setDatumZmeny(''); setPage(1) }}
        />
      }
      page={page}
      totalPages={Math.ceil(293 / PAGE_SIZE)}
      onPageChange={setPage}
      totalCount={293}
    >
      <DataTable cols={cols} rows={pageData as Record<string, unknown>[]} actions={['view', 'restore', 'edit', 'delete']} />
    </ListPageShell>
  )
}
