import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import {
  LayoutDashboard,
  Home,
  BarChart2,
  Briefcase,
  Users,
  FileText,
  Building2,
  Trophy,
  UserCog,
  Calendar,
  ShieldCheck,
  CreditCard,
  ArrowUpRight,
} from 'lucide-react'
import { NavItem, NavGroupHeadline, NavDivider } from '@matusgallo/mysabds'
const CemapIcon = ((_props: { size?: number | string }) => (
  <svg width={16} height={16} viewBox="184.5 13 68 68" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" fill="#d53827" d="m234.14 49.79q-4.29 4.26-9.98 5.4l-0.23-0.4-5.09-8.81q0.48 0.04 0.98 0.04 4.42 0 7.39-2.97 2.97-2.97 2.97-7.54 0-4.57-2.97-7.54-2.97-2.97-7.39-2.97-4.41 0-7.34 2.97-2.94 2.97-2.94 7.54c0 3.73 2.48 7.53 4.36 10.69l5.11 8.85 6.6 11.42-5.28 10.11-6.6-11.42-7.87-13.65c-3.25-5.63-6.14-8.93-6.14-16q0-8.44 5.83-14.28 5.82-5.82 14.27-5.82 8.46 0 14.32 5.82 5.86 5.83 5.86 14.28 0 8.45-5.86 14.28z" />
  </svg>
)) as unknown as LucideIcon

type NavNode =
  | { type: 'item'; label: string; icon?: LucideIcon; path?: string; external?: boolean }
  | { type: 'group'; label: string; icon: LucideIcon; children: NavNode[] }
  | { type: 'headline'; label: string }
  | { type: 'divider' }

const nav: NavNode[] = [
  { type: 'item', label: 'Přehled', icon: LayoutDashboard, path: '/nastanka' },
  {
    type: 'group', label: 'Nabídky', icon: Home,
    children: [
      { type: 'item', label: 'Seznam nabídek', path: '/nabidky' },
      { type: 'item', label: 'K autorizaci', path: '/nabidky/k-autorizaci' },
      { type: 'item', label: 'Moje nabídky', path: '/nabidky/moje' },
    ],
  },
  {
    type: 'group', label: 'Statistiky', icon: BarChart2,
    children: [
      { type: 'item', label: 'Rezervace', path: '/statistiky/rezervace' },
      { type: 'item', label: 'Platby', path: '/statistiky/platby' },
    ],
  },
  {
    type: 'group', label: 'Obchod', icon: Briefcase,
    children: [
      { type: 'item', label: 'Nabídka nemovitostí', path: '/obchod/nabidka-nemovitosti' },
      { type: 'item', label: 'Zájem o výkup', path: '/obchod/zajem-o-vykup' },
      { type: 'item', label: 'Lead Hypo', path: '/obchod/lead-hypo' },
      { type: 'item', label: 'Lead', path: '/obchod/lead' },
      { type: 'item', label: 'Příležitosti', path: '/obchod/prilezitosti' },
    ],
  },
  { type: 'item', label: 'Klienti', icon: Users, path: '/klienti' },
  { type: 'item', label: 'Cemap', icon: CemapIcon, path: 'https://www.cemap.cz', external: true },
  { type: 'divider' },
  { type: 'item', label: 'Dokumenty', icon: FileText, path: '/dokumenty' },
  { type: 'item', label: 'Pobočky', icon: Building2, path: '/pobocky' },
  { type: 'item', label: 'HSP', icon: Trophy, path: '/hsp' },
  { type: 'item', label: 'Uživatelé', icon: UserCog, path: '/uzivatele' },
  { type: 'item', label: 'Kalendář', icon: Calendar, path: '/kalendar' },
  { type: 'item', label: 'Role a práva', icon: ShieldCheck, path: '/role-a-prava' },
  {
    type: 'group', label: 'Vyúčtování', icon: CreditCard,
    children: [
      { type: 'item', label: 'Náklady', path: '/vyuctovani/naklady' },
      { type: 'item', label: 'Storno', path: '/vyuctovani/storno' },
      { type: 'item', label: 'Provize', path: '/vyuctovani/provize' },
      { type: 'item', label: 'Výplaty', path: '/vyuctovani/vyplaty' },
      { type: 'item', label: 'Vyúčtování', path: '/vyuctovani/vyuctovani' },
      { type: 'item', label: 'Faktury', path: '/vyuctovani/faktury' },
    ],
  },
]

interface SidebarProps {
  collapsed: boolean
}

const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(function Sidebar({ collapsed }, ref) {
  const navigate = useNavigate()
  const location = useLocation()
  const [openGroups, setOpenGroups] = useState<string[]>(['Nabídky'])

  function toggleGroup(label: string) {
    setOpenGroups(prev =>
      prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
    )
  }

  function isActive(path?: string) {
    if (!path || path.startsWith('http')) return false
    return location.pathname === path
  }

  function isGroupActive(children: NavNode[]): boolean {
    return children.some(child => {
      if (child.type === 'item') return isActive(child.path)
      if (child.type === 'group') return isGroupActive(child.children)
      return false
    })
  }

  function renderNode(node: NavNode, _index: number, depth: 0 | 1 | 2 = 0): React.ReactNode {
    if (node.type === 'divider') return null

    if (node.type === 'headline') {
      if (collapsed) return null
      return <NavGroupHeadline key={node.label} label={node.label} variant="muted" />
    }

    if (node.type === 'item') {
      const active = isActive(node.path)

      if (node.external) {
        return (
          <NavItem
            key={node.label}
            label={collapsed && depth === 0 ? undefined : node.label}
            icon={node.icon}
            depth={depth}
            iconOnly={collapsed && depth === 0}
            tail={{ type: 'tail-icon', icon: ArrowUpRight }}
            onClick={() => window.open(node.path, '_blank')}
          />
        )
      }

      return (
        <NavItem
          key={node.label}
          label={collapsed && depth === 0 ? undefined : node.label}
          icon={node.icon}
          active={active}
          selected={active}
          depth={depth}
          iconOnly={collapsed && depth === 0}
          onClick={() => node.path && navigate(node.path)}
        />
      )
    }

    if (node.type === 'group') {
      const open = openGroups.includes(node.label)
      const groupActive = isGroupActive(node.children)

      return (
        <div key={node.label}>
          <NavItem
            label={collapsed ? undefined : node.label}
            icon={node.icon}
            active={groupActive && !open}
            selected={groupActive && !open}
            depth={depth}
            iconOnly={collapsed}
            tail={collapsed ? undefined : { type: 'chevron', open }}
            onClick={() => toggleGroup(node.label)}
          />
          {open && !collapsed && (
            <div className="flex flex-col">
              {node.children.map((child, ci) =>
                renderNode(child, ci, Math.min(depth + 1, 2) as 0 | 1 | 2)
              )}
            </div>
          )}
        </div>
      )
    }

    return null
  }

  function renderSections(): React.ReactNode[] {
    const result: React.ReactNode[] = []
    let section: NavNode[] = []
    let sectionIdx = 0

    function flushSection() {
      if (section.length === 0) return
      const nodes = section
      const key = `section-${sectionIdx++}`
      result.push(
        <div key={key} className="px-4 py-2 flex flex-col gap-2">
          {nodes.map((n, i) => renderNode(n, i))}
        </div>
      )
      section = []
    }

    for (let i = 0; i < nav.length; i++) {
      const node = nav[i]
      if (node.type === 'divider') {
        flushSection()
        result.push(<NavDivider key={`divider-${i}`} />)
      } else {
        section.push(node)
      }
    }
    flushSection()

    return result
  }

  return (
    <aside
      ref={ref}
      className="fixed top-[56px] left-0 bottom-0 bg-[var(--t-bgPrimary)] border-r border-[var(--t-borderPrimary)] z-40 overflow-y-auto overflow-x-hidden transition-all duration-200 py-2"
      style={{ width: collapsed ? 'fit-content' : 300 }}
    >
      <nav>
        {renderSections()}
      </nav>
    </aside>
  )
})

export default Sidebar

