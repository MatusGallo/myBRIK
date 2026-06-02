import { useState } from 'react'
import { Badge } from '@matusgallo/mysabds'
import ConfirmDialog from '../components/shared/ConfirmDialog'
import ListPageShell from '../components/shared/ListPageShell'
import DataTable, { type ColDef } from '../components/shared/DataTable'
import PageFilterBar from '../components/shared/PageFilterBar'
import UzivatelPanel from '../components/uzivatele/UzivatelPanel'
import type { UzivatelPanelMode, UzivatelData } from '../components/uzivatele/UzivatelPanel'
import UzivatelHistoriePanel from '../components/uzivatele/UzivatelHistoriePanel'
import UzivatelPravaPanel from '../components/uzivatele/UzivatelPravaPanel'
import { uzivateleData } from '../data/mockOstatni'
import { renderDatum } from '../utils/tableRenders'
import { renderAvatarNameSplit } from '../utils/renderAvatarName'

const PAGE_SIZE = 10

const cols: ColDef[] = [
  { key: 'id', label: 'ID', width: 50 },
  { key: 'jmeno', label: 'Jméno', width: 140, render: renderAvatarNameSplit('jmeno', 'prijmeni') },
  { key: 'prijmeni', label: 'Příjmení', width: 130 },
  { key: 'osobniEmail', label: 'Osobní e-mail', width: 230 },
  { key: 'firemnEmail', label: 'Firemní e-mail', width: 230 },
  { key: 'hsp', label: 'HSP', width: 180 },
  { key: 'pobocka', label: 'Pobočka', width: 220 },
  { key: 'role', label: 'Role', width: 180 },
  { key: 'stav', label: 'Stav', width: 120, render: (row) => (
    <Badge
      label={String(row.stav)}
      size="sm"
      lead="indicator"
      variant={row.stav === 'Aktivní' ? 'success' : 'neutral'}
    />
  )},
  { key: 'pripravnyKurz', label: 'Přípravný kurz', width: 145 },
  { key: 'zkouskaRZ', label: 'Zkouška RŽ', width: 110 },
  { key: 'datumSplneniZkousky', label: 'Datum splnění zkoušky', width: 200 },
  { key: 'pojisteni', label: 'Pojištění', width: 90 },
  { key: 'pojisteniExpirace', label: 'Expirace pojištění', width: 170 },
  { key: 'datumVytvoreni', label: 'Vytvořeno', width: 110, render: renderDatum('datumVytvoreni') },
  { key: 'datumPosledniZmeny', label: 'Upraveno', width: 110, render: renderDatum('datumPosledniZmeny') },
]

export default function UzivatelePage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [panelMode, setPanelMode] = useState<UzivatelPanelMode | null>(null)
  const [selected, setSelected] = useState<UzivatelData | undefined>()
  const [deleteTarget, setDeleteTarget] = useState<UzivatelData | null>(null)
  const [historieTarget, setHistorieTarget] = useState<UzivatelData | null>(null)
  const [pravaTarget, setPravaTarget] = useState<UzivatelData | null>(null)

  function openDetail(row: Record<string, unknown>) {
    const u = row as unknown as UzivatelData
    if (historieTarget) {
      setHistorieTarget(u)
    } else {
      setSelected(u)
      setPanelMode('detail')
    }
  }

  function openEdit(u?: UzivatelData) {
    setSelected(u)
    setPanelMode('edit')
  }
  const [fVytvoreniOd, setFVytvoreniOd] = useState('')
  const [fVytvoreniDo, setFVytvoreniDo] = useState('')
  const [fZmenyOd, setFZmenyOd] = useState('')
  const [fZmenyDo, setFZmenyDo] = useState('')
  const [zkouskaValues, setZkouskaValues] = useState(new Set<string>())
  const [pojisteniValues, setPojisteniValues] = useState(new Set<string>())
  const [kurzValues, setKurzValues] = useState(new Set<string>())

  const toggle = (setter: React.Dispatch<React.SetStateAction<Set<string>>>) => (v: string) =>
    setter(prev => { const next = new Set(prev); next.has(v) ? next.delete(v) : next.add(v); return next })

  const q = search.toLowerCase()
  const filtered = uzivateleData.filter(u => {
    if (q && !`${u.jmeno} ${u.prijmeni} ${u.osobniEmail} ${u.firemnEmail}`.toLowerCase().includes(q)) return false
    if (fVytvoreniOd && u.datumVytvoreni < fVytvoreniOd) return false
    if (fVytvoreniDo && u.datumVytvoreni > fVytvoreniDo) return false
    if (fZmenyOd && u.datumPosledniZmeny < fZmenyOd) return false
    if (fZmenyDo && u.datumPosledniZmeny > fZmenyDo) return false
    if (zkouskaValues.size > 0 && !zkouskaValues.has(u.zkouskaRZ)) return false
    if (pojisteniValues.size > 0 && !pojisteniValues.has(u.pojisteni)) return false
    if (kurzValues.size > 0 && !kurzValues.has(u.pripravnyKurz)) return false
    return true
  })

  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <>
    <ListPageShell
      title="Uživatelé"
      actions={[
        { label: 'Vytvořit uživatele', variant: 'primary', icon: 'plus' },
        { label: 'Export', variant: 'export', icon: 'download' },
      ]}
      filterBar={
        <PageFilterBar
          search={{ value: search, onChange: v => { setSearch(v); setPage(1) }, placeholder: 'Hledat podle jména nebo e-mailu…' }}
          groups={[
            { label: 'Zkouška Realitní zprost.', options: ['Ano', 'Ne'], values: zkouskaValues, onChange: toggle(setZkouskaValues) },
            { label: 'Pojištění', options: ['Ano', 'Ne'], values: pojisteniValues, onChange: toggle(setPojisteniValues) },
            { label: 'Přípravný kurz', options: ['Ano', 'Ne'], values: kurzValues, onChange: toggle(setKurzValues) },
          ]}
          fields={[
            { label: 'Datum vytvoření od', type: 'date', value: fVytvoreniOd, onChange: setFVytvoreniOd },
            { label: 'Datum vytvoření do', type: 'date', value: fVytvoreniDo, onChange: setFVytvoreniDo },
            { label: 'Datum poslední změny od', type: 'date', value: fZmenyOd, onChange: setFZmenyOd },
            { label: 'Datum poslední změny do', type: 'date', value: fZmenyDo, onChange: setFZmenyDo },
          ]}
          onClear={() => {
            setSearch('')
            setFVytvoreniOd(''); setFVytvoreniDo('')
            setFZmenyOd(''); setFZmenyDo('')
            setZkouskaValues(new Set())
            setPojisteniValues(new Set()); setKurzValues(new Set())
            setPage(1)
          }}
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
          actions={['rights', 'history', 'edit', 'delete']}
          onRowClick={openDetail}
          onAction={(action, row) => {
            if (action === 'rights') setPravaTarget(row as unknown as UzivatelData)
            if (action === 'edit') openEdit(row as unknown as UzivatelData)
            if (action === 'history') setHistorieTarget(row as unknown as UzivatelData)
            if (action === 'delete') setDeleteTarget(row as unknown as UzivatelData)
          }}
        />
    </ListPageShell>

      {panelMode && (
        <UzivatelPanel
          mode={panelMode}
          uzivatel={selected}
          onClose={() => setPanelMode(null)}
          onEdit={() => openEdit(selected)}
        />
      )}

      {historieTarget && (
        <UzivatelHistoriePanel
          uzivatel={historieTarget}
          onClose={() => setHistorieTarget(null)}
        />
      )}

      {pravaTarget && (
        <UzivatelPravaPanel
          uzivatel={pravaTarget}
          onClose={() => setPravaTarget(null)}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title={`Smazat uživatele ${deleteTarget.jmeno} ${deleteTarget.prijmeni}?`}
          description="Tato akce je nevratná. Uživatel bude trvale odstraněn ze systému."
          primaryLabel="Smazat"
          secondaryLabel="Zrušit"
          destructive
          onPrimary={() => setDeleteTarget(null)}
          onSecondary={() => setDeleteTarget(null)}
        />
      )}
    </>
  )
}
