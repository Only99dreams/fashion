import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../supabase/client'

const AdminContext = createContext()
const SESSION_KEY = 'fp_admin_session'

function loadSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)) }
  catch { return null }
}

export function AdminProvider({ children }) {
  const [session, setSession] = useState(() => loadSession())
  const [profile, setProfile] = useState(null)
  const booted = useRef(false)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      if (s) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(s))
        setSession(s)
      } else {
        localStorage.removeItem(SESSION_KEY)
        setSession(null)
        setProfile(null)
      }
    })

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(data.session))
        setSession(data.session)
      }
      booted.current = true
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (session?.user) {
      supabase.from('profiles').select('*').eq('id', session.user.id).single()
        .then(({ data }) => setProfile(data || { id: session.user.id, email: session.user.email, full_name: session.user.email, role: 'admin' }))
    } else {
      setProfile(null)
    }
  }, [session?.user?.id])

  const login = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    if (data?.session) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(data.session))
      setSession(data.session)
    }
  }, [])

  const logout = useCallback(async () => {
    await supabase.auth.signOut()
    localStorage.removeItem(SESSION_KEY)
    setSession(null)
    setProfile(null)
  }, [])

  return (
    <AdminContext.Provider value={{ session, profile, login, logout }}>
      {children}
    </AdminContext.Provider>
  )
}

export const useAdmin = () => useContext(AdminContext)