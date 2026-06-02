import { useState, useRef, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import TopBar from './TopBar'
import Sidebar from './Sidebar'

export default function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(300)
  const sidebarRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sidebarRef.current
    if (!el) return
    const ro = new ResizeObserver(() => setSidebarWidth(el.offsetWidth))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-[var(--t-bgSecondary)]">
      <TopBar onToggleSidebar={() => setSidebarCollapsed(prev => !prev)} sidebarCollapsed={sidebarCollapsed} />
      <Sidebar ref={sidebarRef} collapsed={sidebarCollapsed} />
      <main
        className="pt-[56px] transition-all duration-200 min-h-screen flex flex-col"
        style={{ marginLeft: sidebarWidth }}
      >
        <div className="p-6 bg-[var(--t-bgPrimary)] flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
