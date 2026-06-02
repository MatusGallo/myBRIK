import { useState } from 'react'
import ListPageShell from '../components/shared/ListPageShell'
import DataTable from '../components/shared/DataTable'
import PageFilterBar from '../components/shared/PageFilterBar'
import KlientPanel from '../components/klienti/KlientPanel'
import type { KlientPanelMode, KlientData } from '../components/klienti/KlientPanel'
import { klientiData } from '../data/mockOstatni'
import { renderDatum } from '../utils/tableRenders'
import { renderAvatarNameSplit } from '../utils/renderAvatarName'

const PAGE_SIZE = 10

const cols = [
  { key: 'id', label: 'ID', width: 60 },
  { key: 'jmeno', label: 'Jméno', width: 160, render: renderAvatarNameSplit('jmeno', 'prijmeni') },
  { key: 'prijmeni', label: 'Příjmení', width: 160 },
  { key: 'telefon', label: 'Telefon', width: 160 },
  { key: 'email', label: 'E-mail', width: 240, flex: true },
  { key: 'datumVytvoreni', label: 'Vytvořeno', width: 110, render: renderDatum('datumVytvoreni') },
  { key: 'datumPosledniZmeny', label: 'Upraveno', width: 110, render: renderDatum('datumPosledniZmeny') },
]

export default function KlientiPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [panelMode, setPanelMode] = useState<KlientPanelMode | null>(null)
  const [selected, setSelected] = useState<KlientData | undefined>()

  const filtered = search
    ? klientiData.filter(k =>
        [k.jmeno, k.prijmeni, k.email, k.telefon].some(v =>
          v.toLowerCase().includes(search.toLowerCase())
        )
      )
    : klientiData

  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))

  function openDetail(row: Record<string, unknown>) {
    setSelected(row as unknown as KlientData)
    setPanelMode('detail')
  }

  function openEdit(klient?: KlientData) {
    setSelected(klient)
    setPanelMode('edit')
  }

  function openCreate() {
    setSelected(undefined)
    setPanelMode('create')
  }

  return (
    <>
      <ListPageShell
        title="Klienti"
        actions={[{
          label: 'Vytvořit klienta',
          variant: 'primary',
          icon: 'plus',
          onClick: openCreate,
        }]}
        filterBar={
          <PageFilterBar
            search={{ value: search, onChange: setSearch, placeholder: 'Hledat...' }}
            onClear={() => { setSearch(''); setPage(1) }}
          />
        }
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        totalCount={filtered.length}
      >
        <DataTable
          cols={cols}
          rows={pageData as unknown as Record<string, unknown>[]}
          actions={['edit']}
          onRowClick={openDetail}
          onAction={(action, row) => {
            if (action === 'edit') openEdit(row as unknown as KlientData)
          }}
        />
      </ListPageShell>

      {panelMode && (
        <KlientPanel
          mode={panelMode}
          klient={selected}
          onClose={() => setPanelMode(null)}
          onEdit={() => openEdit(selected)}
        />
      )}
    </>
  )
}
