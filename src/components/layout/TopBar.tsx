import { useState } from 'react'
import { PanelLeftClose, PanelLeftOpen, Search, MessageCircle, Settings, Bell } from 'lucide-react'
import { IconButton, TextButton, Avatar } from '@matusgallo/mysabds'
import OdeslatSmsDialog from '../shared/OdeslatSmsDialog'
import myBrikLogo from '../../assets/mybrik-logo.svg'
import AvatarMenu from './AvatarMenu'
import NastaveniModal, { type NastaveniSection } from '../../pages/nastaveni/NastaveniModal'

interface TopBarProps {
  onToggleSidebar: () => void
  sidebarCollapsed: boolean
}

export default function TopBar({ onToggleSidebar, sidebarCollapsed }: TopBarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [avatarHover, setAvatarHover] = useState(false)
  const [smsOpen, setSmsOpen] = useState(false)

  const [nastaveniOpen, setNastaveniOpen] = useState(false)
  const [nastaveniSection, setNastaveniSection] = useState<NastaveniSection>('profil')

  function openNastaveni(section: NastaveniSection) {
    setNastaveniSection(section)
    setNastaveniOpen(true)
  }

  return (
    <>
    <header
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        height: 56,
        paddingTop: 8, paddingBottom: 8, paddingLeft: 16, paddingRight: 16,
        background: 'var(--t-bgPrimary)',
        borderBottom: '1px solid var(--t-borderPrimary)',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        zIndex: 50,
      }}
    >
      {/* Left — hamburger + logo */}
      <div style={{ flex: '1 1 0', display: 'flex', alignItems: 'center', gap: 16 }}>
        <IconButton icon={sidebarCollapsed ? PanelLeftOpen : PanelLeftClose} size="lg" variant="ghost" onClick={onToggleSidebar} tooltip={sidebarCollapsed ? 'Rozbalit menu' : 'Sbalit menu'} />
        <img src={myBrikLogo} alt="myBRIK" style={{ height: 24, width: 'auto' }} />
      </div>

      {/* Center — search bar */}
      <div
        style={{
          width: 480,
          paddingTop: 4, paddingBottom: 4, paddingLeft: 4, paddingRight: 12,
          background: 'var(--t-bgHover)',
          borderRadius: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}
      >
        <div style={{ width: 32, height: 32, padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Search style={{ width: 16, height: 16, color: 'var(--t-textSecondary)' }} />
        </div>
        <input
          type="text"
          placeholder="Vyhledat"
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontFamily: 'Inter',
            fontSize: 14,
            fontWeight: 500,
            lineHeight: '20px',
            color: 'var(--t-textPrimary)',
          }}
        />
      </div>

      {/* Right — actions + avatar */}
      <div style={{ flex: '1 1 0', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8 }}>
        <div style={{ paddingLeft: 12, paddingRight: 12 }}>
          <TextButton label="Odeslat SMS" variant="neutral" size="sm" leadIcon={MessageCircle} onClick={() => setSmsOpen(true)} />
        </div>
        <div style={{ width: 1, height: 16, background: 'var(--t-borderPrimary)', flexShrink: 0 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <IconButton icon={Settings} size="lg" variant="ghost" tooltip="Nastavení" onClick={() => openNastaveni('profil')} />
          <IconButton icon={Bell} size="lg" variant="ghost" tooltip="Notifikace" />
          <div style={{ position: 'relative' }}>
            <div
              style={{
                width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', borderRadius: '50%',
                background: avatarHover || menuOpen ? 'var(--t-bgHover)' : 'transparent',
                transition: 'background 0.15s',
              }}
              onClick={() => setMenuOpen(prev => !prev)}
              onMouseEnter={() => setAvatarHover(true)}
              onMouseLeave={() => setAvatarHover(false)}
            >
              <Avatar size="sm" initials="MG" color="orange" />
            </div>
            <AvatarMenu
              open={menuOpen}
              onClose={() => setMenuOpen(false)}
              onOpenProfil={() => openNastaveni('profil')}
              onOpenZmenaHesla={() => openNastaveni('zmena-hesla')}
            />
          </div>
        </div>
      </div>
    </header>

    {/* SMS modal */}
    {smsOpen && (
      <OdeslatSmsDialog onClose={() => setSmsOpen(false)} />
    )}

    {/* Nastavení modal */}
    <NastaveniModal
      open={nastaveniOpen}
      section={nastaveniSection}
      onSectionChange={setNastaveniSection}
      onClose={() => setNastaveniOpen(false)}
    />
    </>
  )
}
