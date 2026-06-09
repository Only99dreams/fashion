import { useState } from 'react'
import { useAdmin } from '../../context/AdminContext'

function goToDashboard() {
  window.history.pushState(null, '', '/admin/dashboard')
  window.dispatchEvent(new CustomEvent('app:navigate', { detail: 'admin/dashboard' }))
}

export default function AdminLogin() {
  const { login } = useAdmin()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await login(email, password)
      goToDashboard()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="admin-login__card">
      <h1 className="admin-login__logo">FASHIONPHILE</h1>
      <p className="admin-login__subtitle">Admin Dashboard</p>
      <form onSubmit={handleSubmit} className="admin-login__form">
        <div className="admin-login__field">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="admin-login__field">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && <p className="admin-login__error">{error}</p>}
        <button type="submit" className="btn btn--dark" disabled={busy} style={{ width: '100%' }}>
          {busy ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
    </div>
  )
}