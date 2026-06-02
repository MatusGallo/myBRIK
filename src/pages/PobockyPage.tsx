import { useState } from 'react'
import ListPageShell from '../components/shared/ListPageShell'
import DataTable from '../components/shared/DataTable'
import PageFilterBar from '../components/shared/PageFilterBar'
import { Dialog } from '@matusgallo/mysabds'
import { Trash } from 'lucide-react'
import PobockaPanel from '../components/pobocky/PobockaPanel'
import type { PobockaPanelMode, PobockaData } from '../components/pobocky/PobockaPanel'
import { pobockyData, hspData } from '../data/mockOstatni'
import { renderDatum } from '../utils/tableRenders'

const HSP_OPTIONS = hspData.map(h => h.nazev)

const PAGE_SIZE = 10

const cols = [
  { key: 'id', label: 'ID', width: 60 },
  { key: 'nazev', label: 'Název pobočky', width: 260, flex: true },
  { key: 'telefon', label: 'Telefon', width: 140 },
  { key: 'email', label: 'E-mail', width: 220 },
  { key: 'hsp', label: 'HSP', width: 220 },
  { key: 'datumVytvoreni', label: 'Vytvořeno', width: 110, render: renderDatum('datumVytvoreni') },
  { key: 'datumPosledniZmeny', label: 'Upraveno', width: 110, render: renderDatum('datumPosledniZmeny') },
]

export default function PobockyPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [hsp, setHsp] = useState(new Set<string>())
  const [datumVytvoreni, setDatumVytvoreni] = useState('')
  const [datumZmeny, setDatumZmeny] = useState('')
  const [panelMode, setPanelMode] = useState<PobockaPanelMode | null>(null)
  const [selected, setSelected] = useState<PobockaData | undefined>()
  const [deleteTarget, setDeleteTarget] = useState<Record<string, unknown> | null>(null)

  const toggle = (setter: React.Dispatch<React.SetStateAction<Set<string>>>) => (v: string) =>
    setter(prev => { const next = new Set(prev); next.has(v) ? next.delete(v) : next.add(v); return next })

  const pageData = pobockyData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function openDetail(row: Record<string, unknown>) {
    setSelected(row as unknown as PobockaData)
    setPanelMode('detail')
  }

  function openEdit(pobocka?: PobockaData) {
    setSelected(pobocka)
    setPanelMode('edit')
  }

  return (
    <>
      <ListPageShell
        title="Pobočky"
        actions={[{
          label: 'Vytvořit pobočku', variant: 'primary', icon: 'plus',
          onClick: () => { setSelected(undefined); setPanelMode('create') },
        }]}
        filterBar={
          <PageFilterBar
            search={{ value: search, onChange: setSearch, placeholder: 'Hledat dle e-mailu, telefonu, názvu pobočky...' }}
            groups={[
              { label: 'HSP', options: HSP_OPTIONS, values: hsp, onChange: toggle(setHsp), searchable: true },
            ]}
            fields={[
              { label: 'Datum vytvoření', type: 'date', value: datumVytvoreni, onChange: setDatumVytvoreni },
              { label: 'Datum poslední změny', type: 'date', value: datumZmeny, onChange: setDatumZmeny },
            ]}
            onClear={() => { setSearch(''); setHsp(new Set()); setDatumVytvoreni(''); setDatumZmeny(''); setPage(1) }}
          />
        }
        page={page}
        totalPages={Math.ceil(73 / PAGE_SIZE)}
        onPageChange={setPage}
        totalCount={73}
      >
        <DataTable
          cols={cols}
          rows={pageData as Record<string, unknown>[]}
          actions={['delete', 'edit']}
          onRowClick={openDetail}
          onAction={(action, row) => {
            if (action === 'delete') setDeleteTarget(row)
            if (action === 'edit') openEdit(row as unknown as PobockaData)
          }}
        />
      </ListPageShell>

      {panelMode && (
        <PobockaPanel
          mode={panelMode}
          pobocka={selected}
          onClose={() => setPanelMode(null)}
          onEdit={() => openEdit(selected)}
        />
      )}

      {deleteTarget && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 300,
          background: 'rgba(16, 26, 35, 0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Dialog
            icon={Trash}
            destructive
            title="Smazat pobočku"
            description={<>Opravdu chcete smazat pobočku <strong>{String(deleteTarget.nazev ?? '')}</strong>? Tuto akci nelze vrátit zpět.</>}
            primaryLabel="Smazat"
            secondaryLabel="Zrušit"
            onPrimary={() => setDeleteTarget(null)}
            onSecondary={() => setDeleteTarget(null)}
          />
        </div>
      )}
    </>
  )
}
