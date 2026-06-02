import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { Plus, Download, Trash, Copy } from 'lucide-react'
import { Button, Dialog } from '@matusgallo/mysabds'
import NabidkyFilterBar, { NabidkyFilterValues, emptyFilterValues } from '../../components/nabidky/NabidkyFilterBar'
import NabidkyTable, { NABIDKY_COLUMNS } from '../../components/nabidky/NabidkyTable'
import { nabidkyData } from '../../data/mockData'
import type { Nabidka } from '../../data/mockData'
import NovaNabidkaForm from '../../components/nabidky/NovaNabidkaForm'
import { nabidkaToFormData } from '../../components/nabidky/nabidkaToFormData'

const LOCKED = new Set(['id', 'nabidka'])
const ALL_TOGGLEABLE = NABIDKY_COLUMNS.filter(c => !LOCKED.has(c.key)).map(c => c.key)

function applyFilters(data: Nabidka[], f: NabidkyFilterValues) {
  return data.filter(item => {
    if (f.search) {
      const q = f.search.toLowerCase()
      if (
        !item.nazev.toLowerCase().includes(q) &&
        !item.pobocka.toLowerCase().includes(q) &&
        !item.makler.toLowerCase().includes(q)
      ) return false
    }
    if (f.stavy.length > 0 && !f.stavy.includes(item.stavNabidky)) return false
    if (f.typy.length > 0 && !f.typy.includes(item.typObjektu)) return false
    if (f.vyhradni.length === 1) {
      if (f.vyhradni[0] === 'ano' && !item.vyhradni) return false
      if (f.vyhradni[0] === 'ne' && item.vyhradni) return false
    }
    if (f.pobocka && !item.pobocka.toLowerCase().includes(f.pobocka.toLowerCase())) return false
    if (f.makler && !item.makler.toLowerCase().includes(f.makler.toLowerCase())) return false
    if (f.nazevNabidky && !item.nazev.toLowerCase().includes(f.nazevNabidky.toLowerCase())) return false
    if (f.cenaVetsiNez && item.cena <= Number(f.cenaVetsiNez)) return false
    if (f.cenaMensiNez && item.cena >= Number(f.cenaMensiNez)) return false
    return true
  })
}

export default function NabidkyListPage() {
  const navigate = useNavigate()
  const [items, setItems] = useState<Nabidka[]>(nabidkyData)
  const [showCreate, setShowCreate] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [duplicateConfirmId, setDuplicateConfirmId] = useState<number | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [activeFilter, setActiveFilter] = useState<NabidkyFilterValues>(emptyFilterValues)
  const [page, setPage] = useState(1)
  const [hiddenCols, setHiddenCols] = useState<Set<string>>(new Set())

  function duplicateNabidka(target: Nabidka) {
    const newId = items.reduce((max, i) => Math.max(max, i.id), 0) + 1
    const now = new Date()
    const pad = (n: number) => String(n).padStart(2, '0')
    const today = `${pad(now.getDate())}.${pad(now.getMonth() + 1)}.${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}`
    const copy: Nabidka = {
      ...target,
      id: newId,
      nazev: `Kopie – ${target.nazev}`,
      datumVytvoreni: today,
      datumPosledniZmeny: today,
    }
    setItems(prev => [copy, ...prev])
    setPage(1)
  }

  function toggleCol(key: string) {
    setHiddenCols(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  function hideAllCols() { setHiddenCols(new Set(ALL_TOGGLEABLE)) }
  function showAllCols() { setHiddenCols(new Set()) }
  const pageSize = 10
  const filtered = applyFilters(items, activeFilter)
  const totalPages = Math.ceil(filtered.length / pageSize)
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize)

  function handleFilter(values: NabidkyFilterValues) {
    setActiveFilter(values)
    setPage(1)
  }

  if (showCreate) {
    return <NovaNabidkaForm onClose={() => setShowCreate(false)} />
  }

  if (editId !== null) {
    const target = items.find(r => r.id === editId)
    if (target) {
      return <NovaNabidkaForm initialData={nabidkaToFormData(target)} onClose={() => setEditId(null)} />
    }
    setEditId(null)
  }

  const deleteTarget = deleteId !== null ? items.find(r => r.id === deleteId) ?? null : null
  const duplicateConfirmTarget = duplicateConfirmId !== null ? items.find(r => r.id === duplicateConfirmId) ?? null : null

  return (
    <div>
      <div className="flex items-center justify-between h-10 mb-4">
        <h1 className="text-2xl font-semibold text-[var(--t-textPrimary)] leading-none">Nabídky</h1>
        <div className="flex items-center gap-2">
          <Button label="Export" variant="outlined" leadIcon={Download} />
          <Button label="Vytvořit nabídku" variant="primary" leadIcon={Plus} onClick={() => setShowCreate(true)} />
        </div>
      </div>

      <NabidkyFilterBar
        onChange={handleFilter}
        hasData={filtered.length > 0}
        hiddenCols={hiddenCols}
        onToggleCol={toggleCol}
        onHideAllCols={hideAllCols}
        onShowAllCols={showAllCols}
      />

      <NabidkyTable
        data={pageData}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        totalCount={filtered.length}
        hiddenCols={hiddenCols}
        onRowClick={id => navigate(`/nabidky/${id}`)}
        onEdit={id => setEditId(id)}
        onDuplicate={id => setDuplicateConfirmId(id)}
        onDelete={id => setDeleteId(id)}
      />

      {duplicateConfirmTarget && createPortal(
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(10,13,18,0.4)' }} />
          <div style={{ position: 'fixed', inset: 0, zIndex: 201, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <div style={{ pointerEvents: 'auto' }}>
              <Dialog
                icon={Copy}
                title="Duplikovat nabídku?"
                description={<>Vytvoří se kopie nabídky „<span style={{ fontWeight: 600 }}>{duplicateConfirmTarget.nazev}</span>".</>}
                primaryLabel="Duplikovat"
                secondaryLabel="Zrušit"
                onPrimary={() => {
                  duplicateNabidka(duplicateConfirmTarget)
                  setDuplicateConfirmId(null)
                }}
                onSecondary={() => setDuplicateConfirmId(null)}
              />
            </div>
          </div>
        </>,
        document.body,
      )}

      {deleteTarget && createPortal(
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(10,13,18,0.4)' }} />
          <div style={{ position: 'fixed', inset: 0, zIndex: 201, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <div style={{ pointerEvents: 'auto' }}>
              <Dialog
                icon={Trash}
                title="Smazat nabídku?"
                description={<>Opravdu chcete smazat nabídku „<span style={{ fontWeight: 600 }}>{deleteTarget.nazev}</span>"? Tuto akci nelze vrátit.</>}
                primaryLabel="Smazat"
                secondaryLabel="Zrušit"
                destructive
                onPrimary={() => setDeleteId(null)}
                onSecondary={() => setDeleteId(null)}
              />
            </div>
          </div>
        </>,
        document.body,
      )}
    </div>
  )
}

