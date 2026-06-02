import { useState } from 'react'
import ListPageShell from '../components/shared/ListPageShell'
import DataTable from '../components/shared/DataTable'
import PageFilterBar from '../components/shared/PageFilterBar'
import RolePanel from '../components/role/RolePanel'
import type { RolePanelMode, RoleData } from '../components/role/RolePanel'
import { roleData } from '../data/mockOstatni'

const PAGE_SIZE = 20

const cols = [
  { key: 'id', label: 'ID', width: 60 },
  { key: 'nazev', label: 'Název role', width: 300 },
  { key: 'pocetUzivatelu', label: 'Počet uživatelů', width: 160 },
]

export default function RoleAPravaPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [panelMode, setPanelMode] = useState<RolePanelMode | null>(null)
  const [selected, setSelected] = useState<RoleData | undefined>()

  const q = search.toLowerCase()
  const filtered = roleData.filter(r => !q || r.nazev.toLowerCase().includes(q))
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function openDetail(row: Record<string, unknown>) {
    setSelected(row as unknown as RoleData)
    setPanelMode('detail')
  }

  function openEdit(role?: RoleData) {
    setSelected(role)
    setPanelMode('edit')
  }

  return (
    <>
      <ListPageShell
        title="Role a práva"
        filterBar={
          <PageFilterBar
            search={{ value: search, onChange: v => { setSearch(v); setPage(1) }, placeholder: 'Hledat...' }}
            onClear={() => { setSearch(''); setPage(1) }}
          />
        }
        page={page}
        totalPages={Math.ceil(filtered.length / PAGE_SIZE)}
        onPageChange={setPage}
        totalCount={filtered.length}
      >
        <DataTable
          cols={cols}
          rows={pageData as Record<string, unknown>[]}
          actions={['edit']}
          onRowClick={openDetail}
          onAction={(action, row) => {
            if (action === 'edit') openEdit(row as unknown as RoleData)
          }}
        />
      </ListPageShell>

      {panelMode && (
        <RolePanel
          mode={panelMode}
          role={selected}
          onClose={() => setPanelMode(null)}
          onEdit={() => openEdit(selected)}
        />
      )}
    </>
  )
}
