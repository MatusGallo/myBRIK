import { useState } from 'react'
import ListPageShell from '../../components/shared/ListPageShell'
import DataTable from '../../components/shared/DataTable'
import PageFilterBar from '../../components/shared/PageFilterBar'
import LeadHypoPanel from '../../components/obchod/LeadHypoPanel'
import { pobockyData, makleriList } from '../../data/mockOstatni'
import { renderDatum } from '../../utils/tableRenders'
import { renderAvatarName } from '../../utils/renderAvatarName'

const POBOCKY = pobockyData.map(p => p.nazev)
const STAVY = [
  'Klient nekomunikuje', 'Klient nemá zájem', 'Nesprávný kontaktní údaj',
  'Předány doplňující informace', 'Zájem o rezervaci', 'Zájem o schůzku',
]

const cols = [
  { key: 'id', label: 'ID', width: 60 },
  { key: 'produkt', label: 'Produkt', width: 200 },
  { key: 'makler', label: 'Makléř', width: 220, render: renderAvatarName('makler') },
  { key: 'pobocka', label: 'Pobočka', width: 180 },
  { key: 'klient', label: 'Klient', width: 220, render: renderAvatarName('klient') },
  { key: 'stav', label: 'Stav', width: 100 },
  { key: 'datumVytvoreni', label: 'Vytvořeno', width: 110, render: renderDatum('datumVytvoreni') },
  { key: 'datumPosledniZmeny', label: 'Upraveno', width: 110, render: renderDatum('datumPosledniZmeny') },
]

export default function LeadHypoPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [pobocka, setPobocka] = useState(new Set<string>())
  const [makler, setMakler] = useState(new Set<string>())
  const [stav, setStav] = useState(new Set<string>())
  const [panelOpen, setPanelOpen] = useState(false)

  const toggle = (setter: React.Dispatch<React.SetStateAction<Set<string>>>) => (v: string) =>
    setter(prev => { const next = new Set(prev); next.has(v) ? next.delete(v) : next.add(v); return next })

  return (
    <>
      <ListPageShell
        title="Lead Hypo"
        actions={[{ label: 'Vytvořit lead', variant: 'primary', icon: 'plus', onClick: () => setPanelOpen(true) }]}
        filterBar={
          <PageFilterBar
            search={{ value: search, onChange: setSearch, placeholder: 'Hledat dle klienta...' }}
            groups={[
              { label: 'Pobočka', options: POBOCKY, values: pobocka, onChange: toggle(setPobocka), searchable: true },
              { label: 'Makléř', options: makleriList, values: makler, onChange: toggle(setMakler), searchable: true },
              { label: 'Stav', options: STAVY, values: stav, onChange: toggle(setStav), searchable: true },
            ]}
            onClear={() => { setSearch(''); setPobocka(new Set()); setMakler(new Set()); setStav(new Set()); setPage(1) }}
          />
        }
        page={page} totalPages={1} onPageChange={setPage} totalCount={0}
      >
        <DataTable cols={cols} rows={[]} actions={['view', 'restore', 'edit', 'delete']} />
      </ListPageShell>

      {panelOpen && <LeadHypoPanel onClose={() => setPanelOpen(false)} />}
    </>
  )
}
