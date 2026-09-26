import { useEffect, useState } from 'react'
import { Link, NavLink, Navigate, Outlet, useLocation, useNavigate } from 'react-router'
import logoUrl from '../../assets/brand/gios-kebab-logo.jpg'
import { adminRequest, clearCsrf, getCsrf, message } from './api'
import { AuthContext, useOwner } from './authContext'
import { Notice } from './shared'
import type { Owner } from './types'
import './admin.css'

export function AdminGate() {
  const [owner, setOwner] = useState<Owner | null>(null)
  const [checking, setChecking] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)
  const location = useLocation()
  const navigate = useNavigate()
  useEffect(() => { document.title = location.pathname === '/admin/login' ? "Sign in | Gio's Kebab" : "Owner workspace | Gio's Kebab" }, [location.pathname])
  useEffect(() => {
    let current = true
    adminRequest<Owner>('/api/admin/auth/me').then(value => { if (current) setOwner(value) })
      .catch(error => { if (current && !(error instanceof Error && 'status' in error && error.status === 401)) setError(message(error)) })
      .finally(() => { if (current) setChecking(false) })
    return () => { current = false }
  }, [attempt])
  useEffect(() => {
    const expire = () => { setOwner(null); navigate('/admin/login', { replace: true, state: { expired: true } }) }
    window.addEventListener('admin-session-expired', expire)
    return () => window.removeEventListener('admin-session-expired', expire)
  }, [navigate])
  const signOut = async () => {
    await adminRequest<void>('/api/admin/auth/logout', { method: 'POST' })
    clearCsrf(); setOwner(null); navigate('/admin/login', { replace: true })
  }
  if (checking) return <div className="admin-root admin-center" role="status">Checking your session…</div>
  if (error) return <div className="admin-root admin-center"><Notice text={error} /><button className="admin-button" onClick={() => { setError(null); setChecking(true); setAttempt(value => value + 1) }}>Try again</button></div>
  if (!owner) return location.pathname === '/admin/login' ? <AdminLogin onLogin={setOwner} /> : <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  if (location.pathname === '/admin/login') return <Navigate to={(location.state as { from?: string } | null)?.from || '/admin'} replace />
  return <AuthContext.Provider value={{ owner, signOut }}><AdminShell /></AuthContext.Provider>
}

function AdminLogin({ onLogin }: { onLogin: (owner: Owner) => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const location = useLocation()
  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); if (busy) return
    if (new TextEncoder().encode(password).length > 72) { setError('Password is too long.'); return }
    setBusy(true); setError(null)
    try {
      await getCsrf()
      const owner = await adminRequest<Owner>('/api/admin/auth/login', { method: 'POST', body: { email, password } })
      clearCsrf() // Login rotates the session ID; obtain its current CSRF token on the first write.
      setPassword(''); onLogin(owner)
    } catch (error) { setError(message(error)) } finally { setBusy(false) }
  }
  return <div className="admin-root admin-login"><div className="admin-login-brand"><img src={logoUrl} alt="" /><span>Gio's Kebab</span><p>Owner workspace</p></div><main className="admin-login-panel"><p className="admin-kicker">Welcome back</p><h1>Sign in</h1><p className="admin-muted">Manage the details your customers see.</p>{(location.state as { expired?: boolean } | null)?.expired && <Notice text="Your session expired. Sign in to continue." />}
    <form onSubmit={onSubmit}><label className="admin-field"><span>Email</span><input autoFocus type="email" autoComplete="username" value={email} onChange={event => setEmail(event.target.value)} required maxLength={254} /></label><label className="admin-field"><span>Password</span><input type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} required /></label><Notice text={error} /><button className="admin-button" disabled={busy} type="submit">{busy ? 'Signing in…' : 'Sign in'}</button></form><Link className="admin-public-link" to="/">← View public site</Link></main></div>
}

const nav = [{ to: '/admin', label: 'Overview', end: true }, { to: '/admin/restaurant', label: 'Restaurant' }, { to: '/admin/hours', label: 'Hours' }, { to: '/admin/menu', label: 'Menu' }, { to: '/admin/promotions', label: 'Promotions' }]
function AdminShell() {
  const { owner, signOut } = useOwner()
  const [logoutError, setLogoutError] = useState<string | null>(null)
  const [loggingOut, setLoggingOut] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const logout = async () => { if (loggingOut) return; setLoggingOut(true); setLogoutError(null); try { await signOut() } catch (error) { setLogoutError(message(error)); setLoggingOut(false) } }
  return <div className="admin-root"><a className="admin-skip" href="#admin-main">Skip to content</a><header className="admin-top"><Link className="admin-brand" to="/admin" onClick={() => setMenuOpen(false)}><img src={logoUrl} alt="" /><span>Gio's Kebab <small>OWNER</small></span></Link><div className="admin-top-actions"><Link to="/" target="_blank" rel="noopener noreferrer">View site ↗</Link><button type="button" className="admin-mobile-toggle" aria-expanded={menuOpen} aria-controls="admin-nav" onClick={() => setMenuOpen(value => !value)}>{menuOpen ? 'Close' : 'Menu'}</button></div></header><div className="admin-layout"><aside id="admin-nav" className={`admin-sidebar${menuOpen ? ' open' : ''}`}><nav aria-label="Admin navigation">{nav.map(item => <NavLink key={item.to} to={item.to} end={item.end} onClick={() => setMenuOpen(false)}>{item.label}</NavLink>)}</nav><div className="admin-account"><span>Signed in as</span><strong>{owner.email}</strong><button type="button" disabled={loggingOut} onClick={logout}>{loggingOut ? 'Signing out…' : 'Sign out'}</button><Notice text={logoutError} /></div></aside><main id="admin-main" className="admin-main" tabIndex={-1}><Outlet /></main></div></div>
}
