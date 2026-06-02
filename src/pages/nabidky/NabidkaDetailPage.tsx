import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Pencil, Download, Mail, Plus, MoreVertical, Trash2,
  Folder, FolderOpen, Upload,
  ChevronRight, ChevronLeft, X,
  Maximize2, Building2, Clock, Hammer, KeyRound, ShieldCheck, Tag, Calendar,
  type LucideIcon,
} from 'lucide-react'
import {
  IconButton, LineTabGroup, TableHeaderCell, TableCell, Badge,
  Avatar, Button, TextButton, Menu, MenuItem, TextArea, FilterSelect, Alert, Dialog, Search, Breadcrumbs,
} from '@matusgallo/mysabds'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'
import { nabidkyData } from '../../data/mockData'
import OdeslatHypotekariModal from '../../components/nabidky/OdeslatHypotekariModal'
import NovyNakladModal, { type NakladFormData } from '../../components/nabidky/NovyNakladModal'
import OstatniTokModal, { type OstatniTokFormData } from '../../components/nabidky/OstatniTokModal'
import NahratDokumentyModal from '../../components/nabidky/NahratDokumentyModal'
import EmptyState from '../../components/shared/EmptyState'
import NovaNabidkaForm from '../../components/nabidky/NovaNabidkaForm'
import { nabidkaToFormData } from '../../components/nabidky/nabidkaToFormData'

interface OstatniTokRow {
  id: number
  typ: 'prijem' | 'vydaj'
  datum: string
  vs: string
  castka: number
  poznamka: string
}

const KATASTRY = [
  'Brno-město', 'Brno-Žabovřesky', 'Brno-Královo Pole', 'Brno-Bohunice', 'Brno-Líšeň',
  'Praha 1', 'Praha 2', 'Praha 3', 'Praha 4', 'Praha 5', 'Praha 6', 'Praha 7', 'Praha 8',
  'Olomouc-město', 'Plzeň 1', 'Plzeň 2', 'Plzeň 3', 'Plzeň 4',
  'Ostrava-jih', 'Ostrava-Poruba', 'Ostrava-město',
  'Hradec Králové', 'České Budějovice', 'Liberec', 'Pardubice', 'Zlín', 'Jihlava',
  'Mladá Boleslav', 'Karlovy Vary', 'Příbram', 'Tábor', 'Český Krumlov',
]

const OSTATNI_TOKY_INITIAL: OstatniTokRow[] = [
  { id: 1, typ: 'prijem', datum: '31.05.2026', vs: '22', castka: 22, poznamka: 'Test' },
  { id: 2, typ: 'vydaj', datum: '03.06.2026', vs: '222', castka: 222, poznamka: '232' },
]

function rowToTokForm(r: OstatniTokRow): OstatniTokFormData {
  return { typ: r.typ, datum: r.datum, vs: r.vs, castka: String(r.castka), poznamka: r.poznamka }
}

const KATEGORIE_MAP: Record<string, string> = {
  'právní služby': 'pravni-sluzby',
  'staging': 'staging',
  'inzerce vč. sociálních sítí': 'inzerce',
  'geometrické práce': 'geometricke',
  'inspekce nemovitosti': 'inspekce',
  'PENB': 'penb',
  'půdorysy': 'pudorysy',
  '3d prohlídka': '3d',
  'grafické práce': 'graficke',
  'fotografické práce, video': 'foto',
  'vizualizace': 'vizualizace',
  'jiné': 'jine',
  'topování': 'topovani',
}

function rowToNakladForm(r: typeof NAKLADY_ROWS[0]): NakladFormData {
  return {
    nazev: r.nazev,
    dodavatel: r.dodavatel,
    kategorie: KATEGORIE_MAP[r.kategorie] ?? 'jine',
    platba: 'provize',
    datum: r.datum,
    platceDPH: r.castkaSDph !== null,
    dph: '21',
    castka: String(r.castkaBezDph),
  }
}

// ── Mock photos ───────────────────────────────────────────────────────────────

const NABIDKA_PHOTOS = [
  // Exteriér domu
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1600&h=1100&fit=crop&auto=format&q=80',
  // Obývací pokoj
  'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&h=1100&fit=crop&auto=format&q=80',
  // Kuchyně
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&h=1100&fit=crop&auto=format&q=80',
  // Ložnice
  'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1600&h=1100&fit=crop&auto=format&q=80',
  // Koupelna
  'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1600&h=1100&fit=crop&auto=format&q=80',
  // Zahrada
  'https://images.unsplash.com/photo-1593696140826-c58b021acf8b?w=1600&h=1100&fit=crop&auto=format&q=80',
  // Pohled na dům s bazénem
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1600&h=1100&fit=crop&auto=format&q=80',
  // Jídelna
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&h=1100&fit=crop&auto=format&q=80',
]

// ── Mock detail data ──────────────────────────────────────────────────────────

const MOCK_DETAIL = {
  vlastnictvi: 'Osobní',
  stavNemovitosti: 'Velmi dobrý',
  budova: 'Dřevěná',
  uzitnaPocha: 100,
  typTransakce: 'Prodej',
  provizeBezDPH: 10000,
  provizeSdph: 12100,
  podlehaDPH: true,
  maklerJmeno: 'Dominik Bránka',
  maklerEmail: 'beta_dominik.branka@blogic.cz',
  maklerTelefon: '+420 739 437 184',
  popis: 'Nabídka nemovitosti s výbornou dopravní dostupností a infrastrukturou v okolí.',
  garaz: false,
  balkon: false,
  terasa: false,
  vybaveniBytu: true,
  vytah: false,
  bezbarierovy: false,
  rokKolaudace: null as string | null,
  rokRekonstrukce: null as string | null,
  ochrana: 'Ochranné pásmo',
  umisteni: null as string | null,
  podzemPodlazi: null as string | null,
  energetickaTrida: 'G – Mimořádně nehospodárná',
  ukEnergeticke: null as string | null,
  dleVyhlasky: 'Č. 148/2007 Sb.',
  matterport: null as string | null,
  youtube: null as string | null,
  klientJmeno: 'Tonda Vmáčka',
  klientTelefon: '777 888 999',
  klientEmail: 'dominik.branka@blogic.cz',
  klientAdresa: '',
}

const ROZPAD_ROWS = [
  { jmeno: 'Dominik Bránka', pozice: 'Expert I', provize: 7000, naklady: 0, kVyplate: 7000, stav: 'K fakturaci' },
  { jmeno: 'SAB servis s.r.o.', pozice: 'HSP', provize: 3000, naklady: 0, kVyplate: 3000, stav: 'K fakturaci' },
]

const NAKLADY_ROWS = [
  {
    datum: '31.05.2026', nazev: 'Moje workflow', dodavatel: '', kategorie: 'inzerce vč. sociálních sítí',
    castkaBezDph: 10000, castkaSDph: 12100, zProvize: 0, makler: 0, maklerBezStruktury: 12100, hsp: 0,
  },
  {
    datum: '01.06.2026', nazev: 'X', dodavatel: '', kategorie: 'právní služby',
    castkaBezDph: 10000, castkaSDph: null, zProvize: 10000, makler: 0, maklerBezStruktury: 0, hsp: 0,
  },
]

const PORTALS = [
  'Sreality.cz', 'Realitymix.cz', 'Bazoš.cz', 'Realingo', 'Reality iDnes', 'České reality', 'Eurobydlení', 'B3 Technology',
]

const ZEBRICKY_ROWS = [
  { server: 'Sreality', dni: 0, den: 0, celkem: 0 },
  { server: 'Reality MIX', dni: 0, den: 0, celkem: 0 },
  { server: 'Bazoš', dni: 0, den: 0, celkem: 0 },
  { server: 'Realingo', dni: 0, den: 0, celkem: 0 },
  { server: 'Idnes', dni: 0, den: 0, celkem: 0 },
  { server: 'České reality', dni: 0, den: 0, celkem: 0 },
  { server: 'Eurobydlení', dni: 0, den: 0, celkem: 0 },
  { server: 'B3 technology', dni: 0, den: 0, celkem: 0 },
]

interface DokFolderNode {
  id: string
  name: string
  count: number
  children?: DokFolderNode[]
}

const DOK_TREE: DokFolderNode[] = [
  {
    id: 'nabidka', name: 'Nabídka nemovitosti', count: 0,
    children: [
      { id: 'naberovy-list', name: 'Náběrový list', count: 0 },
      { id: 'zprostredkovatelska', name: 'Zprostředkovatelská smlouva', count: 0 },
      { id: 'dodatek-zprostredkovatelska', name: 'Dodatek ke zprostředkovatelské smlouvě', count: 0 },
      { id: 'list-vlastnictvi', name: 'List vlastnictví', count: 0 },
      { id: 'gdpr', name: 'GDPR', count: 0 },
      { id: 'aml', name: 'AML', count: 0 },
      { id: 'vypis-or', name: 'Výpis z OR', count: 0 },
      { id: 'plna-moc', name: 'Plná moc', count: 0 },
      { id: 'kopie-op', name: 'Kopie OP', count: 0 },
      { id: 'dohoda-narovnani', name: 'Dohoda o narovnání', count: 0 },
      { id: 'cenova-mapa', name: 'Cenová mapa', count: 0 },
    ],
  },
  { id: 'rezervace', name: 'Rezervace nemovitosti', count: 0 },
  { id: 'prevod', name: 'Převod / pronájem nemovitosti', count: 0 },
  { id: 'nakladove', name: 'Nákladové položky', count: 0 },
  { id: 'ostatni', name: 'Ostatní', count: 0 },
  { id: 'kos', name: 'Koš', count: 0 },
]

function dokFindFolder(nodes: DokFolderNode[], id: string): DokFolderNode | undefined {
  for (const n of nodes) {
    if (n.id === id) return n
    if (n.children) {
      const found = dokFindFolder(n.children, id)
      if (found) return found
    }
  }
}

function dokGetAncestors(nodes: DokFolderNode[], id: string, path: DokFolderNode[] = []): DokFolderNode[] {
  for (const n of nodes) {
    if (n.id === id) return [...path, n]
    if (n.children) {
      const result = dokGetAncestors(n.children, id, [...path, n])
      if (result.length) return result
    }
  }
  return []
}


// ── Helpers ───────────────────────────────────────────────────────────────────

function formatCena(cena: number) {
  return new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 }).format(cena)
}

type BadgeVariant = 'neutral' | 'outline' | 'invert' | 'brand' | 'info' | 'success' | 'warning' | 'danger'

function stavVariant(stav: string): BadgeVariant {
  const s = stav.toLowerCase()
  if (s === 'aktivní') return 'brand'
  if (s === 'podepsaná smlouva' || s === 'zobchodováno') return 'success'
  if (s.includes('storno') || s.includes('spor') || s === 'rezervace zrušeno') return 'danger'
  if (s.startsWith('v převodu') || s === 'rezervace') return 'warning'
  return 'neutral'
}


function getInitials(name: string): string {
  return name.split(' ').map(w => w[0] ?? '').join('').slice(0, 2).toUpperCase()
}

const AVATAR_COLOR_KEYS = ['purple', 'blue', 'orange', 'green', 'teal', 'red', 'pink', 'dark'] as const
function getAvatarColor(name: string): typeof AVATAR_COLOR_KEYS[number] {
  const hash = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return AVATAR_COLOR_KEYS[hash % AVATAR_COLOR_KEYS.length]
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatTile({ icon: Icon, label, value, accent }: { icon: LucideIcon; label: string; value: string; accent?: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Icon size={13} style={{ color: 'var(--t-textSecondary)', flexShrink: 0 }} />
        {/* body14Regular */}
        <span style={{ fontSize: 14, fontWeight: 400, lineHeight: '20px', color: 'var(--t-textSecondary)' }}>
          {label}
        </span>
      </div>
      {/* body14Semibold */}
      <span style={{
        fontSize: 14, fontWeight: 600, lineHeight: '20px',
        color: accent ? '#E05524' : 'var(--t-textPrimary)',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        paddingLeft: 19,
      }}>
        {value}
      </span>
    </div>
  )
}

function DokCountBadge({ count }: { count: number }) {
  return (
    <div style={{
      height: 20, padding: '0 6px', flexShrink: 0,
      background: 'var(--t-bgPrimary)', borderRadius: 9999,
      outline: '1px solid var(--t-borderPrimary)', outlineOffset: -1,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <span style={{ fontSize: 11, fontWeight: 600, lineHeight: '12px', color: 'var(--t-textPrimary)' }}>{count}</span>
    </div>
  )
}

function DokTreeItem({
  folder, depth = 0, selected, expanded, onSelect, onToggle,
}: {
  folder: DokFolderNode
  depth?: number
  selected: string | null
  expanded: Set<string>
  onSelect: (id: string) => void
  onToggle: (id: string) => void
}) {
  const [hovered, setHovered] = useState(false)
  const isActive = selected === folder.id
  const isExpanded = expanded.has(folder.id)
  const hasChildren = (folder.children?.length ?? 0) > 0
  const Icon = hasChildren && isExpanded ? FolderOpen : Folder
  const indent = depth === 0 ? 0 : depth === 1 ? 20 : 48

  const bg = isActive ? 'var(--t-bgMyDOCKTertiary)' : hovered ? 'var(--t-bgHover)' : 'transparent'
  const iconColor = isActive ? 'var(--t-textMyDOCKPrimary)' : 'var(--t-textSecondary)'
  const textColor = isActive ? 'var(--t-textMyDOCKPrimary)' : 'var(--t-textPrimary)'

  return (
    <div>
      <button
        onClick={() => { onSelect(folder.id); if (hasChildren) onToggle(folder.id) }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: '100%', height: 32,
          paddingLeft: 12 + indent, paddingRight: 8,
          display: 'flex', alignItems: 'center', gap: 8,
          borderRadius: isActive || hovered ? 8 : 0,
          background: bg, border: 'none', cursor: 'pointer', textAlign: 'left',
          transition: 'background 0.15s',
        }}
      >
        <Icon size={16} style={{ flexShrink: 0, color: iconColor }} />
        <span style={{
          flex: 1, fontSize: 14, fontWeight: 500, lineHeight: '20px',
          color: textColor, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {folder.name}
        </span>
        {hasChildren ? (
          <ChevronRight size={16} style={{
            flexShrink: 0, color: 'var(--t-textSecondary)',
            transform: isExpanded ? 'rotate(90deg)' : 'none',
            transition: 'transform 0.15s',
          }} />
        ) : (
          <DokCountBadge count={folder.count} />
        )}
      </button>
      {hasChildren && isExpanded && (
        <div>
          {folder.children!.map(child => (
            <DokTreeItem
              key={child.id}
              folder={child}
              depth={depth + 1}
              selected={selected}
              expanded={expanded}
              onSelect={onSelect}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function Widget({ children, padding = 20 }: { children: React.ReactNode; padding?: number | string }) {
  return (
    <div style={{
      background: 'var(--t-bgPrimary)',
      border: '1px solid var(--t-borderPrimary)',
      borderRadius: 12,
      padding,
    }}>
      {children}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 18, fontWeight: 600, lineHeight: '26px', color: 'var(--t-textPrimary)', marginBottom: 12 }}>
        {title}
      </div>
      {children}
    </div>
  )
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 16, fontWeight: 600, lineHeight: '24px', color: 'var(--t-textPrimary)', marginBottom: 10 }}>
        {title}
      </div>
      {children}
    </div>
  )
}

type KVValue = string | number | boolean | null | undefined

function KVList({ items }: { items: [string, KVValue][] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {items.map(([label, value]) => {
        const isEmpty = value === null || value === undefined || value === ''
        const display = typeof value === 'boolean' ? (value ? 'Ano' : 'Ne') : (isEmpty ? '—' : String(value))
        return (
          <div
            key={label}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              height: 24, gap: 24,
            }}
          >
            <span style={{
              fontSize: 14, fontWeight: 400, lineHeight: '20px',
              color: 'var(--t-textSecondary)', flexShrink: 0,
            }}>
              {label}
            </span>
            <span style={{
              fontSize: 14, fontWeight: 500, lineHeight: '20px',
              color: 'var(--t-textPrimary)', textAlign: 'right',
            }}>
              {display}
            </span>
          </div>
        )
      })}
    </div>
  )
}

function KVRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', gap: 12, fontSize: 14, minHeight: 28, alignItems: 'center' }}>
      <span style={{ color: 'var(--t-textSecondary)', width: 160, flexShrink: 0 }}>{label}</span>
      <span style={{ color: 'var(--t-textPrimary)', fontWeight: 500 }}>{value || '–'}</span>
    </div>
  )
}

// ── Tabs ──────────────────────────────────────────────────────────────────────

const TABS = [
  { value: 'zakladni', label: 'Základní informace' },
  { value: 'exporty', label: 'Exporty' },
  { value: 'finance', label: 'Finance' },
  { value: 'ostatni', label: 'Ostatní finanční toky' },
  { value: 'list', label: 'List vlastnictví' },
  { value: 'dokumenty', label: 'Dokumenty' },
  { value: 'hypoteka', label: 'Hypotéka' },
]

// ── Page ──────────────────────────────────────────────────────────────────────

export default function NabidkaDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [tab, setTab] = useState('zakladni')
  const [exportPortal, setExportPortal] = useState<string | null>(null)
  const [dokSelected, setDokSelected] = useState<string | null>('nabidka')
  const [dokExpanded, setDokExpanded] = useState<Set<string>>(new Set(['nabidka']))
  const [nahratOpen, setNahratOpen] = useState(false)
  const [internalNote, setInternalNote] = useState('')
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [activePhoto, setActivePhoto] = useState(0)
  const [moreMenuOpen, setMoreMenuOpen] = useState(false)
  const moreMenuRef = useRef<HTMLDivElement>(null)
  const [hypotekariOpen, setHypotekariOpen] = useState(false)
  const [novyNakladOpen, setNovyNakladOpen] = useState(false)
  const [editNakladData, setEditNakladData] = useState<NakladFormData | null>(null)
  const [deleteNakladIdx, setDeleteNakladIdx] = useState<number | null>(null)
  const [tokAddOpen, setTokAddOpen] = useState(false)
  const [tokEdit, setTokEdit] = useState<OstatniTokRow | null>(null)
  const [tokDelete, setTokDelete] = useState<OstatniTokRow | null>(null)
  const [katastr, setKatastr] = useState<string | null>(null)
  const [katastrOpen, setKatastrOpen] = useState(false)
  const [katastrSearch, setKatastrSearch] = useState('')
  const [cisloLv, setCisloLv] = useState('')
  const [editOpen, setEditOpen] = useState(false)
  const katastrRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!katastrOpen) return
    const handler = (e: MouseEvent) => {
      if (katastrRef.current && !katastrRef.current.contains(e.target as Node)) {
        setKatastrOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [katastrOpen])

  useEffect(() => {
    if (!moreMenuOpen) return
    const handler = (e: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setMoreMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [moreMenuOpen])

  useEffect(() => {
    if (!galleryOpen) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') setActivePhoto(p => (p - 1 + NABIDKA_PHOTOS.length) % NABIDKA_PHOTOS.length)
      if (e.key === 'ArrowRight') setActivePhoto(p => (p + 1) % NABIDKA_PHOTOS.length)
      if (e.key === 'Escape') setGalleryOpen(false)
    }
    window.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [galleryOpen])

  const n = nabidkyData.find(r => r.id === Number(id))
  if (!n) {
    return <div style={{ padding: 24, color: 'var(--t-textSecondary)' }}>Nabídka nenalezena.</div>
  }

  if (editOpen) {
    return <NovaNabidkaForm initialData={nabidkaToFormData(n)} onClose={() => setEditOpen(false)} />
  }

  const d = MOCK_DETAIL


  const chartData = Array.from({ length: 31 }, (_, i) => ({ den: `${i + 1}.`, hodnota: 0 }))

  return (
    <div style={{ margin: -24, background: 'var(--t-bgSecondary)', minHeight: 'calc(100vh - 56px)' }}>

      {/* Header bar */}
      <div style={{ position: 'sticky', top: 56, zIndex: 10, background: 'var(--t-bgSecondary)', borderBottom: '1px solid var(--t-borderPrimary)' }}>
        <div style={{ maxWidth: 1440, margin: '0 auto', padding: '0 24px' }}>
          {/* Title row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, padding: '24px 0 16px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, minWidth: 0 }}>
              <div style={{ marginTop: 2 }}>
                <IconButton icon={ArrowLeft} variant="ghost" size="md" tooltip="Zpět na seznam" onClick={() => navigate('/nabidky')} />
              </div>
              <div style={{ minWidth: 0 }}>
                {/* typography.headline24 */}
                <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, lineHeight: '32px', color: 'var(--t-textPrimary)' }}>
                  {n.nazev}
                </h1>
                <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                  <Badge label={`ID ${n.id}`} variant="neutral" size="sm" />
                  <Badge label={n.stavNabidky} variant={stavVariant(n.stavNabidky)} size="sm" lead="indicator" />
                  <Badge label={n.typObjektu.charAt(0).toUpperCase() + n.typObjektu.slice(1)} variant="outline" size="sm" />
                </div>
              </div>
            </div>

            {/* Akce */}
            <div style={{ display: 'flex', gap: 8, flexShrink: 0, alignItems: 'center' }}>
              <Button label="Upravit" variant="soft" leadIcon={Pencil} onClick={() => setEditOpen(true)} />
              <div style={{ position: 'relative' }}>
                <div onClick={e => { e.stopPropagation(); setMoreMenuOpen(o => !o) }}>
                  <IconButton icon={MoreVertical} variant="outlined" size="lg" tooltip="Další akce" />
                </div>
                {moreMenuOpen && (
                  <div ref={moreMenuRef} style={{ position: 'absolute', top: 44, right: 0, zIndex: 50 }}>
                    <Menu>
                      <MenuItem label="Stáhnout fotografie" leadIcon={Download} onClick={() => setMoreMenuOpen(false)} />
                      <MenuItem label="Odeslat hypotékáři" leadIcon={Mail} onClick={() => { setMoreMenuOpen(false); setHypotekariOpen(true) }} />
                    </Menu>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tabs — flush with the header's bottom border */}
          <LineTabGroup tabs={TABS} value={tab} onChange={setTab} />
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: 1440, margin: '0 auto', padding: 24 }}>

        {/* ── Main column ───────────────────────────────────────────────────── */}
        <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Property hero card — only on Základní informace tab */}
          {tab === 'zakladni' && (
          <div style={{ background: 'var(--t-bgPrimary)', border: '1px solid var(--t-borderPrimary)', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '420px 1fr', gap: 32, padding: 24 }}>

              {/* Photo gallery preview */}
              <div
                onClick={() => { setActivePhoto(0); setGalleryOpen(true) }}
                style={{
                  position: 'relative', borderRadius: 10, overflow: 'hidden',
                  cursor: 'pointer', aspectRatio: '4 / 3', background: 'var(--t-bgSecondary)',
                }}
                onMouseEnter={e => {
                  const overlay = e.currentTarget.querySelector('[data-overlay]') as HTMLElement
                  if (overlay) overlay.style.opacity = '1'
                }}
                onMouseLeave={e => {
                  const overlay = e.currentTarget.querySelector('[data-overlay]') as HTMLElement
                  if (overlay) overlay.style.opacity = '0'
                }}
              >
                <img
                  src={NABIDKA_PHOTOS[0]}
                  alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <div
                  data-overlay
                  style={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(0,0,0,0.35)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    opacity: 0, transition: 'opacity 150ms',
                  }}
                >
                  <span style={{ color: '#fff', fontSize: 14, fontWeight: 600, padding: '8px 16px', background: 'rgba(0,0,0,0.5)', borderRadius: 8 }}>
                    Zobrazit galerii ({NABIDKA_PHOTOS.length})
                  </span>
                </div>
                <div style={{
                  position: 'absolute', bottom: 10, right: 10,
                  background: 'rgba(0,0,0,0.65)', color: '#fff',
                  padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 500,
                }}>
                  1 / {NABIDKA_PHOTOS.length}
                </div>
              </div>

              {/* Right column — price + 2-column stat tiles */}
              <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, gap: 16 }}>

                {/* Price + provize */}
                <div>
                  <span style={{ fontSize: 36, fontWeight: 700, color: '#E05524', lineHeight: 1, display: 'block', letterSpacing: '-0.5px' }}>
                    {formatCena(n.cena)}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 14, color: 'var(--t-textSecondary)' }}>
                      Provize{' '}
                      <span style={{ color: 'var(--t-textPrimary)', fontWeight: 600 }}>{formatCena(d.provizeBezDPH)}</span>
                      {' / '}
                      <span style={{ color: 'var(--t-textPrimary)', fontWeight: 600 }}>{formatCena(d.provizeSdph)}</span>
                      {' s DPH'}
                    </span>
                    {d.podlehaDPH && <Badge label="Podléhá DPH" variant="outline" size="sm" />}
                  </div>
                </div>

                {/* Divider */}
                <div style={{ height: 1, background: 'var(--t-borderPrimary)' }} />

                {/* Stat tiles — 2 columns × 4 rows (last item spans 2 cols) */}
                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr',
                  columnGap: 32, rowGap: 16,
                }}>
                  <StatTile icon={Maximize2} label="Užitná plocha" value={`${d.uzitnaPocha} m²`} />
                  <StatTile icon={KeyRound} label="Vlastnictví" value={d.vlastnictvi} />
                  <StatTile icon={Tag} label="Typ transakce" value={d.typTransakce} accent />
                  <StatTile icon={ShieldCheck} label="Stav nemovitosti" value={d.stavNemovitosti} />
                  <StatTile icon={Hammer} label="Budova" value={d.budova} />
                  <StatTile icon={Building2} label="Pobočka" value={n.pobocka} />
                  <div style={{ gridColumn: '1 / -1' }}>
                    <StatTile icon={Clock} label="Poslední změna" value={n.datumPosledniZmeny} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          )}

          {/* ── Základní informace ─────────────────────────────────────── */}
          {tab === 'zakladni' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* 2-column section: Detaily nemovitosti (left) + Popis + Kontaktní osoba + Leady + Poznámka (right stacked) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'flex-start' }}>

                {/* Left column: Detaily nemovitosti */}
                <Widget>
                  <Section title="Detaily nemovitosti">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                      <SubSection title="Další zařízení">
                        <KVList items={[
                          ['Garáž', d.garaz],
                          ['Balkón', d.balkon],
                          ['Terasa', d.terasa],
                          ['Vybavení bytu', d.vybaveniBytu],
                          ['Výtah', d.vytah],
                          ['Bezbariérový', d.bezbarierovy],
                        ]} />
                      </SubSection>
                      <div style={{ height: 1, background: 'var(--t-borderPrimary)' }} />
                      <SubSection title="Rozšířené informace o stavbě">
                        <KVList items={[
                          ['Rok kolaudace', d.rokKolaudace],
                          ['Rok rekonstrukce', d.rokRekonstrukce],
                          ['Ochrana', d.ochrana],
                          ['Umístění', d.umisteni],
                          ['Podzemních podlaží', d.podzemPodlazi],
                        ]} />
                      </SubSection>
                      <div style={{ height: 1, background: 'var(--t-borderPrimary)' }} />
                      <SubSection title="Energetická náročnost objektu">
                        <KVList items={[
                          ['En. náročnost', d.energetickaTrida],
                          ['Uk. en. náročnosti', d.ukEnergeticke],
                          ['Dle vyhlášky', d.dleVyhlasky],
                        ]} />
                      </SubSection>
                      <div style={{ height: 1, background: 'var(--t-borderPrimary)' }} />
                      <SubSection title="Vizualizace">
                        <KVList items={[
                          ['Matterport', d.matterport],
                          ['Youtube', d.youtube],
                        ]} />
                      </SubSection>
                    </div>
                  </Section>
                </Widget>

                {/* Right column: Makléř + Popis + Kontaktní osoba + Leady + Poznámka */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <Widget>
                    <Section title="Makléř">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Avatar
                          initials={getInitials(d.maklerJmeno)}
                          size="lg"
                          color={getAvatarColor(d.maklerJmeno)}
                        />
                        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
                          {/* body16Semibold */}
                          <div style={{ fontSize: 16, fontWeight: 600, lineHeight: '24px', color: 'var(--t-textPrimary)' }}>
                            {d.maklerJmeno}
                          </div>
                          {/* body14Regular */}
                          <div style={{ display: 'flex', gap: 12, fontSize: 14, fontWeight: 400, lineHeight: '20px', color: 'var(--t-textSecondary)', marginTop: 2, flexWrap: 'wrap' }}>
                            <span>{d.maklerEmail}</span>
                            <span style={{ color: 'var(--t-borderPrimary)' }}>·</span>
                            <span>{d.maklerTelefon}</span>
                          </div>
                        </div>
                      </div>
                    </Section>
                  </Widget>

                  <Widget>
                    <Section title="Popis nemovitosti">
                      <p style={{ margin: 0, fontSize: 14, lineHeight: '22px', color: 'var(--t-textPrimary)' }}>
                        {d.popis}
                      </p>
                    </Section>
                  </Widget>

                  <Widget>
                    <Section title="Kontaktní osoba">
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <KVRow label="Jméno a příjmení" value={d.klientJmeno} />
                        <KVRow label="Telefon" value={d.klientTelefon} />
                        <KVRow label="E-mail" value={d.klientEmail} />
                        <KVRow label="Adresa" value={d.klientAdresa} />
                      </div>
                    </Section>
                  </Widget>

                  <Widget>
                    <Section title="Nejnovější leady">
                      <div style={{ fontSize: 13, color: 'var(--t-textSecondary)' }}>
                        Momentálně neexistuje lead na tuto nabídku.
                      </div>
                    </Section>
                  </Widget>

                  <Widget>
                    <Section title="Interní poznámka">
                      <TextArea
                        value={internalNote}
                        onChange={setInternalNote}
                        placeholder="Interní poznámka k nabídce, viditelná jen pro tým…"
                        width="100%"
                        minHeight={96}
                      />
                    </Section>
                  </Widget>
                </div>
              </div>
            </div>
          )}


          {/* ── Exporty ────────────────────────────────────────────────── */}
          {tab === 'exporty' && (
          <>
            <Widget padding={24}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                  {/* Filter row — date range | portal filters | Exportovat (right) */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                    <FilterSelect
                      label="29.04.2026 – 29.05.2026"
                      leadIcon={Calendar}
                      selected={false}
                      onClick={() => {}}
                    />
                    <div style={{ width: 1, height: 16, background: 'var(--t-borderPrimary)', flexShrink: 0 }} />
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, flex: 1 }}>
                      <FilterSelect
                        label="Vše"
                        selected={exportPortal === null}
                        onClick={() => setExportPortal(null)}
                      />
                      {PORTALS.map(p => (
                        <FilterSelect
                          key={p}
                          label={p}
                          selected={exportPortal === p}
                          onClick={() => setExportPortal(exportPortal === p ? null : p)}
                        />
                      ))}
                    </div>
                    <TextButton label="Exportovat" variant="brand" leadIcon={Download} />
                  </div>

                  {/* Chart */}
                  <div style={{ height: 360 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--t-borderPrimary)" />
                        <XAxis dataKey="den" tick={{ fontSize: 11, fill: 'var(--t-textSecondary)' }} interval={4} />
                        <YAxis domain={[0, 1]} tickCount={11} tick={{ fontSize: 11, fill: 'var(--t-textSecondary)' }} />
                        <Line type="monotone" dataKey="hodnota" stroke="#E05524" dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Summary stats — 4 standalone boxes + 1 multi-stat box */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
                    {/* 4 main stats */}
                    {[
                      { label: 'Počet zobrazení', value: '0' },
                      { label: 'Denní průměr', value: '0' },
                      { label: 'Počet zájmů', value: '2' },
                      { label: 'Konverzní poměr', value: '0 %' },
                    ].map(s => (
                      <div key={s.label} style={{
                        padding: '20px 20px',
                        border: '1px solid var(--t-borderPrimary)', borderRadius: 8,
                        background: 'var(--t-bgSecondary)',
                        display: 'flex', flexDirection: 'column',
                        justifyContent: 'center', gap: 4,
                      }}>
                        {/* body14Regular */}
                        <span style={{ fontSize: 14, fontWeight: 400, lineHeight: '20px', color: 'var(--t-textSecondary)' }}>
                          {s.label}
                        </span>
                        <span style={{
                          fontSize: 28, fontWeight: 700, lineHeight: '36px', letterSpacing: '-0.4px',
                          color: 'var(--t-textPrimary)',
                        }}>
                          {s.value}
                        </span>
                      </div>
                    ))}

                    {/* Side box — 3 lifetime stats as compact KV list */}
                    <div style={{
                      padding: '16px 20px',
                      border: '1px solid var(--t-borderPrimary)', borderRadius: 8,
                      background: 'var(--t-bgSecondary)',
                      display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 6,
                    }}>
                      {[
                        { label: 'Dní v nabídce', value: '0' },
                        { label: 'Počet zobrazení', value: '0' },
                        { label: 'Denní průměr', value: '0,00' },
                      ].map(r => (
                        <div key={r.label} style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                        }}>
                          {/* body14Regular */}
                          <span style={{ fontSize: 14, fontWeight: 400, lineHeight: '20px', color: 'var(--t-textSecondary)' }}>
                            {r.label}
                          </span>
                          {/* body14Semibold */}
                          <span style={{ fontSize: 14, fontWeight: 600, lineHeight: '20px', color: 'var(--t-textPrimary)' }}>
                            {r.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
            </Widget>

            {/* Log exportu + Žebříček — separate widgets, 2-column */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Widget padding={20}>
                <Section title="Log exportu">
                  <div style={{ display: 'flex', background: 'var(--t-bgSecondary)', borderRadius: 8, overflow: 'hidden' }}>
                    <div style={{ flex: 1, pointerEvents: 'none' }}><TableHeaderCell label="Datum" width="100%" /></div>
                    <div style={{ flex: 1, pointerEvents: 'none' }}><TableHeaderCell label="Server" width="100%" /></div>
                    <div style={{ flex: 2, pointerEvents: 'none' }}><TableHeaderCell label="Popis" width="100%" /></div>
                  </div>
                  <div style={{ padding: '24px 0', textAlign: 'center', fontSize: 13, color: 'var(--t-textSecondary)' }}>
                    Žádné záznamy.
                  </div>
                </Section>
              </Widget>

              <Widget padding={20}>
                <Section title="Žebříček">
                  <div>
                    {/* Header */}
                    <div style={{ display: 'flex', background: 'var(--t-bgSecondary)', borderRadius: 8, overflow: 'hidden' }}>
                      <div style={{ flex: 2, pointerEvents: 'none' }}>
                        <TableHeaderCell label="Server" width="100%" />
                      </div>
                      {['Dní', 'Ø den', 'Celkem'].map(col => (
                        <div key={col} className="th-right" style={{ flex: 1, pointerEvents: 'none' }}>
                          <TableHeaderCell label={col} width="100%" />
                        </div>
                      ))}
                    </div>
                    {/* Rows */}
                    {ZEBRICKY_ROWS.map((r, i) => {
                      const isLast = i === ZEBRICKY_ROWS.length - 1
                      return (
                        <div key={r.server} style={{ display: 'flex' }}>
                          <div style={{ flex: 2 }}>
                            <TableCell size="sm" width="100%" hovered={false} borderBottom={!isLast} label={r.server} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <TableCell size="sm" width="100%" hovered={false} borderBottom={!isLast} label={String(r.dni)} align="right" />
                          </div>
                          <div style={{ flex: 1 }}>
                            <TableCell size="sm" width="100%" hovered={false} borderBottom={!isLast} label={String(r.den)} align="right" />
                          </div>
                          <div style={{ flex: 1 }}>
                            <TableCell size="sm" width="100%" hovered={false} borderBottom={!isLast} label={String(r.celkem)} align="right" />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </Section>
              </Widget>
            </div>
          </>
          )}

          {/* ── Finance ────────────────────────────────────────────────── */}
          {tab === 'finance' && (
          <>
            {/* Náklady widget */}
            <Widget padding={24}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ fontSize: 18, fontWeight: 600, lineHeight: '26px', color: 'var(--t-textPrimary)' }}>Náklady</div>
                <TextButton label="Nový náklad" variant="brand" leadIcon={Plus} onClick={() => setNovyNakladOpen(true)} />
              </div>
              <div style={{ overflow: 'auto' }}>
                {/* Header */}
                <div style={{ display: 'flex', background: 'var(--t-bgSecondary)', borderRadius: 8 }}>
                  <div style={{ width: 110, flexShrink: 0, pointerEvents: 'none' }}><TableHeaderCell label="Datum" width="100%" /></div>
                  <div style={{ flex: 1, minWidth: 160, pointerEvents: 'none' }}><TableHeaderCell label="Název" width="100%" /></div>
                  <div style={{ flex: 1, minWidth: 160, pointerEvents: 'none' }}><TableHeaderCell label="Dodavatel" width="100%" /></div>
                  <div style={{ flex: 1, minWidth: 160, pointerEvents: 'none' }}><TableHeaderCell label="Kategorie" width="100%" /></div>
                  {['Částka bez DPH', 'Částka s DPH', 'Z provize', 'Makléř', 'Makléř (bez str.)', 'HSP'].map(col => (
                    <div key={col} className="th-right" style={{ width: 140, flexShrink: 0, pointerEvents: 'none' }}>
                      <TableHeaderCell label={col} width="100%" />
                    </div>
                  ))}
                  <div style={{
                    width: 100, flexShrink: 0, pointerEvents: 'none',
                    position: 'sticky', right: 0, zIndex: 2,
                    background: 'var(--t-bgSecondary)',
                  }}><TableHeaderCell empty width="100%" /></div>
                </div>
                {/* Data rows */}
                {NAKLADY_ROWS.map((r, idx) => {
                  return (
                    <div key={`${r.datum}-${r.nazev}`} style={{ display: 'flex' }}>
                      <div style={{ width: 110, flexShrink: 0 }}>
                        <TableCell size="sm" width="100%" hovered={false} borderBottom label={r.datum} />
                      </div>
                      <div style={{ flex: 1, minWidth: 160 }}>
                        <TableCell size="sm" width="100%" hovered={false} borderBottom label={r.nazev} />
                      </div>
                      <div style={{ flex: 1, minWidth: 160 }}>
                        <TableCell size="sm" width="100%" hovered={false} borderBottom label={r.dodavatel || '—'} />
                      </div>
                      <div style={{ flex: 1, minWidth: 160 }}>
                        <TableCell size="sm" width="100%" hovered={false} borderBottom label={r.kategorie} />
                      </div>
                      <div style={{ width: 140, flexShrink: 0 }}>
                        <TableCell size="sm" width="100%" hovered={false} borderBottom align="right" label={formatCena(r.castkaBezDph)} />
                      </div>
                      <div style={{ width: 140, flexShrink: 0 }}>
                        <TableCell size="sm" width="100%" hovered={false} borderBottom align="right" label={r.castkaSDph === null ? '—' : formatCena(r.castkaSDph)} />
                      </div>
                      <div style={{ width: 140, flexShrink: 0 }}>
                        <TableCell size="sm" width="100%" hovered={false} borderBottom align="right" label={formatCena(r.zProvize)} />
                      </div>
                      <div style={{ width: 140, flexShrink: 0 }}>
                        <TableCell size="sm" width="100%" hovered={false} borderBottom align="right" label={formatCena(r.makler)} />
                      </div>
                      <div style={{ width: 140, flexShrink: 0 }}>
                        <TableCell size="sm" width="100%" hovered={false} borderBottom align="right" label={formatCena(r.maklerBezStruktury)} />
                      </div>
                      <div style={{ width: 140, flexShrink: 0 }}>
                        <TableCell size="sm" width="100%" hovered={false} borderBottom align="right" label={formatCena(r.hsp)} />
                      </div>
                      <div style={{
                        width: 100, flexShrink: 0,
                        position: 'sticky', right: 0, zIndex: 1,
                        background: 'var(--t-bgPrimary)',
                      }}>
                        <TableCell
                          size="sm" width="100%" hovered={false} borderBottom
                          content={
                            <div style={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                              <IconButton icon={Pencil} variant="ghost" size="md" tooltip="Upravit náklad" onClick={() => setEditNakladData(rowToNakladForm(r))} />
                              <span className="icon-trash-primary">
                                <IconButton icon={Trash2} variant="ghost" size="md" tooltip="Smazat náklad" onClick={() => setDeleteNakladIdx(idx)} />
                              </span>
                            </div>
                          }
                        />
                      </div>
                    </div>
                  )
                })}
                {/* Totals row */}
                <div style={{ display: 'flex', background: 'var(--t-bgSecondary)', borderRadius: '0 0 8px 8px', overflow: 'hidden' }}>
                  <div style={{ width: 110 + 160 + 160 + 160, flexShrink: 0 }}>
                    <TableCell size="sm" width="100%" hovered={false} borderBottom={false} align="right"
                      content={<span style={{ fontSize: 13, fontWeight: 500, color: 'var(--t-textSecondary)' }}>Náklady celkem:</span>}
                    />
                  </div>
                  <div style={{ width: 140, flexShrink: 0 }}>
                    <TableCell size="sm" width="100%" hovered={false} borderBottom={false} align="right"
                      content={<span style={{ fontSize: 14, fontWeight: 600 }}>{formatCena(NAKLADY_ROWS.reduce((s, r) => s + r.castkaBezDph, 0))}</span>}
                    />
                  </div>
                  <div style={{ width: 140, flexShrink: 0 }}>
                    <TableCell size="sm" width="100%" hovered={false} borderBottom={false} align="right"
                      content={<span style={{ fontSize: 14, fontWeight: 600 }}>{formatCena(NAKLADY_ROWS.reduce((s, r) => s + (r.castkaSDph ?? 0), 0))}</span>}
                    />
                  </div>
                  <div style={{ width: 140, flexShrink: 0 }}>
                    <TableCell size="sm" width="100%" hovered={false} borderBottom={false} align="right"
                      content={<span style={{ fontSize: 14, fontWeight: 600 }}>{formatCena(NAKLADY_ROWS.reduce((s, r) => s + r.zProvize, 0))}</span>}
                    />
                  </div>
                  <div style={{ width: 140, flexShrink: 0 }}>
                    <TableCell size="sm" width="100%" hovered={false} borderBottom={false} align="right"
                      content={<span style={{ fontSize: 14, fontWeight: 600 }}>{formatCena(NAKLADY_ROWS.reduce((s, r) => s + r.makler, 0))}</span>}
                    />
                  </div>
                  <div style={{ width: 140, flexShrink: 0 }}>
                    <TableCell size="sm" width="100%" hovered={false} borderBottom={false} align="right"
                      content={<span style={{ fontSize: 14, fontWeight: 600 }}>{formatCena(NAKLADY_ROWS.reduce((s, r) => s + r.maklerBezStruktury, 0))}</span>}
                    />
                  </div>
                  <div style={{ width: 140, flexShrink: 0 }}>
                    <TableCell size="sm" width="100%" hovered={false} borderBottom={false} align="right"
                      content={<span style={{ fontSize: 14, fontWeight: 600 }}>{formatCena(NAKLADY_ROWS.reduce((s, r) => s + r.hsp, 0))}</span>}
                    />
                  </div>
                  <div style={{
                    width: 100, flexShrink: 0,
                    position: 'sticky', right: 0, zIndex: 1,
                    background: 'var(--t-bgSecondary)',
                  }}>
                    <TableCell size="sm" width="100%" hovered={false} borderBottom={false} label="" />
                  </div>
                </div>
              </div>
            </Widget>

            {/* Rozpad do struktury widget */}
            <Widget padding={24}>
              <div style={{ fontSize: 18, fontWeight: 600, lineHeight: '26px', color: 'var(--t-textPrimary)', marginBottom: 12 }}>
                Rozpad do struktury (uvedené částky jsou bez DPH)
              </div>
              <Alert
                variant="warning"
                label="Dokud není zakázka ve stavu zobchodováno. Níže uvedené údaje jsou pouze orientační."
              />
              <div style={{ marginTop: 16 }}>
                {/* Header */}
                <div style={{ display: 'flex', background: 'var(--t-bgSecondary)', borderRadius: 8, overflow: 'hidden' }}>
                  <div style={{ flex: 3, pointerEvents: 'none' }}><TableHeaderCell label="Jméno" width="100%" /></div>
                  <div style={{ flex: 2, pointerEvents: 'none' }}><TableHeaderCell label="Pozice" width="100%" /></div>
                  {['Provize', 'Náklady', 'K výplatě'].map(col => (
                    <div key={col} className="th-right" style={{ flex: 2, pointerEvents: 'none' }}>
                      <TableHeaderCell label={col} width="100%" />
                    </div>
                  ))}
                  <div style={{ flex: 1, pointerEvents: 'none' }}><TableHeaderCell label="Stav" width="100%" /></div>
                </div>
                {/* Rows */}
                {ROZPAD_ROWS.map((r, i) => {
                  const isLast = i === ROZPAD_ROWS.length - 1
                  return (
                    <div key={r.jmeno} style={{ display: 'flex' }}>
                      <div style={{ flex: 3 }}>
                        <TableCell size="sm" width="100%" hovered={false} borderBottom={!isLast} label={r.jmeno} />
                      </div>
                      <div style={{ flex: 2 }}>
                        <TableCell size="sm" width="100%" hovered={false} borderBottom={!isLast} label={r.pozice} />
                      </div>
                      <div style={{ flex: 2 }}>
                        <TableCell size="sm" width="100%" hovered={false} borderBottom={!isLast} align="right" label={formatCena(r.provize)} />
                      </div>
                      <div style={{ flex: 2 }}>
                        <TableCell size="sm" width="100%" hovered={false} borderBottom={!isLast} align="right" label={formatCena(r.naklady)} />
                      </div>
                      <div style={{ flex: 2 }}>
                        <TableCell size="sm" width="100%" hovered={false} borderBottom={!isLast} align="right" label={formatCena(r.kVyplate)} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <TableCell
                          size="sm" width="100%" hovered={false} borderBottom={!isLast}
                          content={<Badge label={r.stav} variant="warning" size="sm" lead="indicator" />}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </Widget>
          </>
          )}

          {/* ── Ostatní finanční toky ──────────────────────────────────── */}
          {tab === 'ostatni' && (
            <Widget padding={24}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: 18, fontWeight: 600, lineHeight: '26px', color: 'var(--t-textPrimary)' }}>Ostatní finanční toky</div>
                  <TextButton label="Přidat" variant="brand" leadIcon={Plus} onClick={() => setTokAddOpen(true)} />
                </div>

                <div>
                  {/* Header */}
                  <div style={{ display: 'flex', background: 'var(--t-bgSecondary)', borderRadius: 8 }}>
                    <div style={{ width: 120, flexShrink: 0, pointerEvents: 'none' }}><TableHeaderCell label="Datum" width="100%" /></div>
                    <div style={{ width: 120, flexShrink: 0, pointerEvents: 'none' }}><TableHeaderCell label="Typ" width="100%" /></div>
                    <div style={{ width: 140, flexShrink: 0, pointerEvents: 'none' }}><TableHeaderCell label="VS" width="100%" /></div>
                    <div className="th-right" style={{ width: 160, flexShrink: 0, pointerEvents: 'none' }}>
                      <TableHeaderCell label="Částka" width="100%" />
                    </div>
                    <div style={{ flex: 1, minWidth: 200, pointerEvents: 'none' }}><TableHeaderCell label="Poznámka" width="100%" /></div>
                    <div style={{ width: 100, flexShrink: 0, pointerEvents: 'none' }}><TableHeaderCell empty width="100%" /></div>
                  </div>

                  {/* Rows */}
                  {OSTATNI_TOKY_INITIAL.length === 0 ? (
                    <div style={{ padding: '24px 0', textAlign: 'center', fontSize: 13, color: 'var(--t-textSecondary)' }}>
                      Žádné výsledky.
                    </div>
                  ) : (
                    OSTATNI_TOKY_INITIAL.map(r => {
                      const isPrijem = r.typ === 'prijem'
                      const rowBg = isPrijem ? '#F0FDF4' : '#FEF2F2'
                      return (
                        <div key={r.id} style={{ display: 'flex', background: rowBg }}>
                          <div style={{ width: 120, flexShrink: 0 }}>
                            <TableCell size="sm" width="100%" hovered={false} borderBottom label={r.datum} />
                          </div>
                          <div style={{ width: 120, flexShrink: 0 }}>
                            <TableCell
                              size="sm" width="100%" hovered={false} borderBottom
                              content={
                                <Badge
                                  label={isPrijem ? 'Příjem' : 'Výdaj'}
                                  variant={isPrijem ? 'success' : 'danger'}
                                  size="sm"
                                />
                              }
                            />
                          </div>
                          <div style={{ width: 140, flexShrink: 0 }}>
                            <TableCell size="sm" width="100%" hovered={false} borderBottom label={r.vs} />
                          </div>
                          <div style={{ width: 160, flexShrink: 0 }}>
                            <TableCell
                              size="sm" width="100%" hovered={false} borderBottom align="right"
                              content={
                                <span style={{ fontSize: 14, fontWeight: 600, color: isPrijem ? 'var(--t-textSuccessPrimary)' : 'var(--t-textDangerPrimary)' }}>
                                  {(isPrijem ? '+ ' : '− ') + formatCena(r.castka)}
                                </span>
                              }
                            />
                          </div>
                          <div style={{ flex: 1, minWidth: 200 }}>
                            <TableCell size="sm" width="100%" hovered={false} borderBottom label={r.poznamka || '—'} />
                          </div>
                          <div style={{ width: 100, flexShrink: 0 }}>
                            <TableCell
                              size="sm" width="100%" hovered={false} borderBottom
                              content={
                                <div style={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                  <IconButton icon={Pencil} variant="ghost" size="md" tooltip="Upravit" onClick={() => setTokEdit(r)} />
                                  <span className="icon-trash-primary">
                                    <IconButton icon={Trash2} variant="ghost" size="md" tooltip="Smazat" onClick={() => setTokDelete(r)} />
                                  </span>
                                </div>
                              }
                            />
                          </div>
                        </div>
                      )
                    })
                  )}

                  {/* Saldo */}
                  {OSTATNI_TOKY_INITIAL.length > 0 && (() => {
                    const saldo = OSTATNI_TOKY_INITIAL.reduce((s, r) => s + (r.typ === 'prijem' ? r.castka : -r.castka), 0)
                    return (
                      <div style={{ display: 'flex', background: 'var(--t-bgSecondary)', borderRadius: '0 0 8px 8px' }}>
                        <div style={{ width: 120 + 120 + 140, flexShrink: 0 }}>
                          <TableCell size="sm" width="100%" hovered={false} borderBottom={false} align="right"
                            content={<span style={{ fontSize: 13, fontWeight: 500, color: 'var(--t-textSecondary)' }}>Saldo:</span>}
                          />
                        </div>
                        <div style={{ width: 160, flexShrink: 0 }}>
                          <TableCell size="sm" width="100%" hovered={false} borderBottom={false} align="right"
                            content={
                              <span style={{
                                fontSize: 14, fontWeight: 700,
                                color: saldo >= 0 ? 'var(--t-textSuccessPrimary)' : 'var(--t-textDangerPrimary)',
                              }}>
                                {(saldo >= 0 ? '' : '− ') + formatCena(Math.abs(saldo))}
                              </span>
                            }
                          />
                        </div>
                        <div style={{ flex: 1, minWidth: 200 }}>
                          <TableCell size="sm" width="100%" hovered={false} borderBottom={false} label="" />
                        </div>
                        <div style={{ width: 100, flexShrink: 0 }}>
                          <TableCell size="sm" width="100%" hovered={false} borderBottom={false} label="" />
                        </div>
                      </div>
                    )
                  })()}
                </div>
              </div>
            </Widget>
          )}

          {/* ── List vlastnictví ──────────────────────────────────────── */}
          {tab === 'list' && (
            <Widget padding={24}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Filter row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <Search
                    placeholder="Číslo LV"
                    value={cisloLv}
                    onChange={setCisloLv}
                    size="sm"
                    width={240}
                  />
                  <div ref={katastrRef} style={{ position: 'relative' }}>
                    <FilterSelect
                      label={katastr ?? 'Katastrální území'}
                      selected={!!katastr}
                      onClick={() => setKatastrOpen(o => !o)}
                    />
                    {katastrOpen && (
                      <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, zIndex: 50 }}>
                        <Menu width={320}>
                          <div style={{ padding: '8px 12px' }}>
                            <Search
                              placeholder="Hledat katastrální území…"
                              value={katastrSearch}
                              onChange={setKatastrSearch}
                              size="sm"
                              width="100%"
                            />
                          </div>
                          <div style={{ maxHeight: 280, overflowY: 'auto' }}>
                            {KATASTRY
                              .filter(k => k.toLowerCase().includes(katastrSearch.toLowerCase()))
                              .map(k => (
                                <MenuItem
                                  key={k}
                                  label={k}
                                  onClick={() => { setKatastr(k); setKatastrOpen(false); setKatastrSearch('') }}
                                />
                              ))}
                          </div>
                          {katastr && (
                            <>
                              <div style={{ height: 1, background: 'var(--t-borderPrimary)' }} />
                              <MenuItem label="Vymazat výběr" onClick={() => { setKatastr(null); setKatastrOpen(false) }} />
                            </>
                          )}
                        </Menu>
                      </div>
                    )}
                  </div>
                  <div style={{ marginLeft: 'auto' }}>
                    <TextButton label="Stáhnout LV" variant="brand" leadIcon={Download} />
                  </div>
                </div>

                {/* Empty state — žádné stažené LV */}
                <EmptyState
                  title="Zatím zde nejsou žádné záznamy"
                  description="Po stažení listu vlastnictví se zde zobrazí historie."
                />
              </div>
            </Widget>
          )}

          {/* ── Dokumenty ─────────────────────────────────────────────── */}
          {tab === 'dokumenty' && (() => {
            const selectedFolder = dokSelected ? dokFindFolder(DOK_TREE, dokSelected) : null
            const ancestors = dokSelected ? dokGetAncestors(DOK_TREE, dokSelected) : []
            const subFolders = selectedFolder?.children ?? []
            const toggleDokExpand = (id: string) => setDokExpanded(prev => {
              const next = new Set(prev)
              next.has(id) ? next.delete(id) : next.add(id)
              return next
            })
            const breadcrumbItems = ancestors.map(crumb => ({
              label: crumb.name,
              onClick: () => setDokSelected(crumb.id),
            }))
            return (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16, alignItems: 'flex-start' }}>

                {/* Left tree widget */}
                <Widget padding={0}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '16px 16px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                      {/* typography.subheadline18Semibold */}
                      <span style={{ fontSize: 18, fontWeight: 600, lineHeight: '26px', color: 'var(--t-textPrimary)', flex: 1 }}>Dokumenty</span>
                      <TextButton label="Nahrát" variant="brand" leadIcon={Upload} onClick={() => setNahratOpen(true)} />
                    </div>
                    <div style={{ padding: 8, display: 'flex', flexDirection: 'column', overflowY: 'auto', flex: 1 }}>
                      {DOK_TREE.map(folder => (
                        <DokTreeItem
                          key={folder.id}
                          folder={folder}
                          selected={dokSelected}
                          expanded={dokExpanded}
                          onSelect={setDokSelected}
                          onToggle={toggleDokExpand}
                        />
                      ))}
                    </div>
                  </div>
                </Widget>

                {/* Right content widget */}
                <Widget padding={24}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 24, minWidth: 0 }}>
                    {/* Breadcrumbs + title */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <Breadcrumbs items={breadcrumbItems} />
                      <span style={{ fontSize: 18, fontWeight: 600, lineHeight: '26px', color: 'var(--t-textPrimary)' }}>
                        {selectedFolder?.name ?? 'Dokumenty'}
                      </span>
                    </div>

                    {/* Subfolders */}
                    {subFolders.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {/* typography.body16Semibold */}
                        <span style={{ fontSize: 16, fontWeight: 600, lineHeight: '24px', color: 'var(--t-textPrimary)' }}>Složky</span>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 16 }}>
                          {subFolders.map(child => (
                            <div
                              key={child.id}
                              onClick={() => { setDokSelected(child.id); setDokExpanded(prev => new Set([...prev, child.id])) }}
                              style={{
                                height: 56, paddingLeft: 12, paddingRight: 12,
                                background: 'var(--t-bgSecondary)', borderRadius: 8,
                                display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
                              }}
                            >
                              <Folder size={16} style={{ flexShrink: 0, color: 'var(--t-textSecondary)' }} />
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 14, fontWeight: 500, lineHeight: '20px', color: 'var(--t-textPrimary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {child.name}
                                </div>
                                <div style={{ fontSize: 12, fontWeight: 400, lineHeight: '16px', letterSpacing: '0.12px', color: 'var(--t-textSecondary)' }}>
                                  {child.count} {child.count === 1 ? 'Soubor' : 'Souborů'}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Files section */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {/* typography.body16Semibold */}
                      <span style={{ fontSize: 16, fontWeight: 600, lineHeight: '24px', color: 'var(--t-textPrimary)' }}>Soubory</span>
                      <EmptyState
                        title="Nejsou zde žádné soubory"
                        description="Nahrajte první soubor a zobrazí se v této složce."
                      />
                    </div>
                  </div>
                </Widget>
              </div>
            )
          })()}

          {/* ── Hypotéka ──────────────────────────────────────────────── */}
          {tab === 'hypoteka' && (
            <Widget padding={24}>
              <Section title="Žádosti o hypotéku odeslané do Mydock">
                <EmptyState
                  title="Zatím nejsou žádné žádosti"
                  description="Po odeslání žádosti o hypotéku do Mydock se zde zobrazí přehled."
                />
              </Section>
            </Widget>
          )}

        </div>

      </div>

      {/* Odeslat hypotékáři modal */}
      {hypotekariOpen && <OdeslatHypotekariModal onClose={() => setHypotekariOpen(false)} />}

      {/* Nový náklad modal */}
      {novyNakladOpen && <NovyNakladModal onClose={() => setNovyNakladOpen(false)} />}

      {/* Editace nákladu modal */}
      {editNakladData && <NovyNakladModal initialData={editNakladData} onClose={() => setEditNakladData(null)} />}

      {/* Smazat náklad confirm dialog */}
      {deleteNakladIdx !== null && createPortal(
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(10,13,18,0.4)' }} />
          <div style={{ position: 'fixed', inset: 0, zIndex: 201, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <div style={{ pointerEvents: 'auto' }}>
              <Dialog
                icon={Trash2}
                title="Smazat náklad?"
                description="Tuto akci nelze vrátit."
                primaryLabel="Smazat"
                secondaryLabel="Zrušit"
                destructive
                onPrimary={() => setDeleteNakladIdx(null)}
                onSecondary={() => setDeleteNakladIdx(null)}
              />
            </div>
          </div>
        </>,
        document.body,
      )}

      {/* Přidat / Editovat tok modal */}
      {tokAddOpen && <OstatniTokModal onClose={() => setTokAddOpen(false)} />}
      {tokEdit && <OstatniTokModal initialData={rowToTokForm(tokEdit)} onClose={() => setTokEdit(null)} />}

      {/* Nahrát dokumenty modal */}
      {nahratOpen && <NahratDokumentyModal onClose={() => setNahratOpen(false)} defaultKategorie={dokSelected ?? undefined} />}

      {/* Smazat tok confirm dialog */}
      {tokDelete && createPortal(
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(10,13,18,0.4)' }} />
          <div style={{ position: 'fixed', inset: 0, zIndex: 201, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <div style={{ pointerEvents: 'auto' }}>
              <Dialog
                icon={Trash2}
                title={`Smazat ${tokDelete.typ === 'prijem' ? 'příjem' : 'výdaj'}?`}
                description="Tuto akci nelze vrátit."
                primaryLabel="Smazat"
                secondaryLabel="Zrušit"
                destructive
                onPrimary={() => setTokDelete(null)}
                onSecondary={() => setTokDelete(null)}
              />
            </div>
          </div>
        </>,
        document.body,
      )}

      {/* Photo gallery lightbox */}
      {galleryOpen && createPortal(
        <div
          onClick={() => setGalleryOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.92)',
            display: 'flex', flexDirection: 'column',
          }}
        >
          {/* Top bar */}
          <div
            onClick={e => e.stopPropagation()}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px 24px', color: '#fff',
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 500 }}>
              {activePhoto + 1} / {NABIDKA_PHOTOS.length}
            </span>
            <button
              onClick={() => setGalleryOpen(false)}
              style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                color: '#fff', padding: 8, display: 'flex', borderRadius: 8,
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <X size={24} />
            </button>
          </div>

          {/* Main image with prev/next */}
          <div
            onClick={e => e.stopPropagation()}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative', padding: '0 80px', minHeight: 0,
            }}
          >
            <button
              onClick={() => setActivePhoto(p => (p - 1 + NABIDKA_PHOTOS.length) % NABIDKA_PHOTOS.length)}
              style={{
                position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer',
                color: '#fff', padding: 12, borderRadius: '50%', display: 'flex',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
            >
              <ChevronLeft size={28} />
            </button>

            <img
              src={NABIDKA_PHOTOS[activePhoto]}
              alt=""
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: 8 }}
            />

            <button
              onClick={() => setActivePhoto(p => (p + 1) % NABIDKA_PHOTOS.length)}
              style={{
                position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer',
                color: '#fff', padding: 12, borderRadius: '50%', display: 'flex',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
            >
              <ChevronRight size={28} />
            </button>
          </div>

          {/* Thumbnails */}
          <div
            onClick={e => e.stopPropagation()}
            style={{
              display: 'flex', gap: 8, padding: '16px 24px',
              overflowX: 'auto', justifyContent: 'center',
            }}
          >
            {NABIDKA_PHOTOS.map((photo, i) => (
              <img
                key={i}
                src={photo}
                alt=""
                onClick={() => setActivePhoto(i)}
                style={{
                  width: 96, height: 64, objectFit: 'cover', flexShrink: 0,
                  borderRadius: 6, cursor: 'pointer',
                  opacity: i === activePhoto ? 1 : 0.55,
                  border: i === activePhoto ? '2px solid #E05524' : '2px solid transparent',
                  transition: 'opacity 150ms, border 150ms',
                }}
              />
            ))}
          </div>
        </div>,
        document.body,
      )}
    </div>
  )
}
