import { useState, useEffect } from 'react'

function parsePath() {
  const hash = window.location.hash
  if (hash.startsWith('#/')) {
    const clean = hash.slice(1)
    window.history.replaceState(null, '', clean)
    return clean.replace(/^\//, '').replace(/\/$/, '') || ''
  }
  return window.location.pathname.replace(/^\//, '').replace(/\/$/, '') || ''
}

export default function Router({ routes, defaultRoute, resolve, notFound }) {
  const [path, setPath] = useState(() => parsePath() || defaultRoute)

  useEffect(() => {
    const onPopState = () => setPath(parsePath() || defaultRoute)
    const onNavigate = (e) => setPath(e.detail || defaultRoute)
    window.addEventListener('popstate', onPopState)
    window.addEventListener('app:navigate', onNavigate)
    return () => {
      window.removeEventListener('popstate', onPopState)
      window.removeEventListener('app:navigate', onNavigate)
    }
  }, [defaultRoute])

  const route = routes[path]
  if (route) return route
  if (resolve) {
    const resolved = resolve(path)
    if (resolved) return resolved
  }
  if (notFound) return notFound
  return routes[defaultRoute]
}
