import { useState, useEffect, useRef } from 'react'
import { useAdmin } from '../../context/AdminContext'

function getPath() {
  return window.location.pathname.replace(/^\//, '').replace(/\/$/, '') || ''
}

const navItems = [
  { label: 'Dashboard', path: 'admin/dashboard', icon: '📊' },
  { label: 'Products', path: 'admin/products', icon: '📦' },
  { label: 'Orders', path: 'admin/orders', icon: '📋' },
  { label: 'Customers', path: 'admin/customers', icon: '👥' },
  { label: 'Analytics', path: 'admin/analytics', icon: '📈' },
  { label: 'Settings', path: 'admin/settings', icon: '⚙️' },
]

export default function AdminLayout({ children, isLoginPage = false }) {
  const { session, profile, logout } = useAdmin()
  const [currentPath, setCurrentPath] = useState(getPath)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const redirected = useRef(false)

  useEffect(() => {
    const onPop = () => setCurrentPath(getPath())
    const onNav = (e) => setCurrentPath(e.detail || '')
    window.addEventListener('popstate', onPop)
    window.addEventListener('app:navigate', onNav)
    return () => {
      window.removeEventListener('popstate', onPop)
      window.removeEventListener('app:navigate', onNav)
    }
  }, [])

  useEffect(() => {
    redirected.current = false
  }, [isLoginPage, !!session])

  useEffect(() => {
    if (redirected.current) return
    if (isLoginPage && session) {
      redirected.current = true
      const path = '/admin/dashboard'
      window.history.pushState(null, '', path)
      window.dispatchEvent(new CustomEvent('app:navigate', { detail: 'admin/dashboard' }))
    } else if (!isLoginPage && !session) {
      redirected.current = true
      const path = '/admin/login'
      window.history.pushState(null, '', path)
      window.dispatchEvent(new CustomEvent('app:navigate', { detail: 'admin/login' }))
    }
  }, [isLoginPage, session])

  if (isLoginPage) {
    return <div className="admin-login">{children}</div>
  }

  if (!session) {
    return null
  }

  function toggleSidebar() {
    setSidebarOpen((v) => !v)
  }

  return (
    <div className={`admin-layout${sidebarOpen ? '' : ' admin-layout--sidebar-closed'}`}>
      <button className="admin-sidebar-toggle" onClick={toggleSidebar} aria-label="Toggle sidebar">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>
      <div className="admin-sidebar-backdrop" onClick={toggleSidebar} />
      <aside className={`admin-sidebar${sidebarOpen ? '' : ' admin-sidebar--hidden'}`}>
        <div className="admin-sidebar__header">
          <h2 className="admin-sidebar__logo">FP Admin</h2>
          <button className="admin-sidebar__close" onClick={toggleSidebar} aria-label="Close sidebar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <nav className="admin-sidebar__nav">
          {navItems.map((item) => {
            const isActive = currentPath === item.path || currentPath.startsWith(item.path + '/')
            return (
              <a
                key={item.path}
                href={`/${item.path}`}
                className={`admin-sidebar__link${isActive ? ' admin-sidebar__link--active' : ''}`}
              >
                <span className="admin-sidebar__icon">{item.icon}</span>
                {item.label}
              </a>
            )
          })}
        </nav>
        <div className="admin-sidebar__footer">
          <div className="admin-sidebar__user">
            <span className="admin-sidebar__user-name">{profile?.full_name || session?.user?.email}</span>
            <button className="admin-sidebar__logout" onClick={logout}>Sign Out</button>
          </div>
        </div>
      </aside>
      <main className="admin-main">
        {children}
      </main>
    </div>
  )
}