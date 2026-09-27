import { useEffect, useState } from 'react'
import { Link, NavLink, Navigate, Outlet, useLocation, useNavigate } from 'react-router'
import logoUrl from '../../assets/brand/gios-kebab-logo.jpg'
import { readAdminLocale, saveAdminLocale, type AdminLocale } from '../../lib/i18n/locales'
import { adminRequest, clearCsrf, getCsrf, message } from './api'
import { AuthContext, useOwner } from './authContext'
import { AdminLanguageContext, useAdminLanguage } from './languageContext'
import { Notice } from './shared'
import { adminText } from './text'
import type { Owner } from './types'
import './admin.css'

type AdminTheme = 'light' | 'dark'
const themeStorageKey = 'gios-admin-theme'
function readTheme(): AdminTheme {
  try { return window.localStorage.getItem(themeStorageKey) === 'dark' ? 'dark' : 'light' } catch { return 'light' }
}

export function AdminGate() {
  const [locale, setLocale] = useState<AdminLocale>(readAdminLocale)
  const [theme, setTheme] = useState<AdminTheme>(readTheme)
  const choose = (next: AdminLocale) => { saveAdminLocale(next); setLocale(next) }
  const toggleTheme = () => setTheme(current => {
    const next = current === 'light' ? 'dark' : 'light'
    try { window.localStorage.setItem(themeStorageKey, next) } catch { /* Theme remains usable for this session. */ }
    return next
  })
  useEffect(() => { document.documentElement.lang = locale }, [locale])
  return <AdminLanguageContext.Provider value={{ locale, setLocale: choose, t: adminText[locale] }}><AdminGateContent theme={theme} onToggleTheme={toggleTheme} /></AdminLanguageContext.Provider>
}

function AdminGateContent({ theme, onToggleTheme }: { theme: AdminTheme; onToggleTheme: () => void }) {
  const { t } = useAdminLanguage()
  const [owner, setOwner] = useState<Owner | null>(null)
  const [checking, setChecking] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)
  const location = useLocation()
  const navigate = useNavigate()
  useEffect(() => { document.title = location.pathname === '/admin/login' ? `${t.signIn} | Gio's Kebab` : `${t.ownerWorkspace} | Gio's Kebab` }, [location.pathname, t])
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
  if (checking) return <div className="admin-root admin-center" data-theme={theme} role="status">{t.checkingSession}</div>
  if (error) return <div className="admin-root admin-center" data-theme={theme}><Notice text={error} /><button className="admin-button" onClick={() => { setError(null); setChecking(true); setAttempt(value => value + 1) }}>{t.tryAgain}</button></div>
  if (!owner) return location.pathname === '/admin/login' ? <AdminLogin onLogin={setOwner} theme={theme} onToggleTheme={onToggleTheme} /> : <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  if (location.pathname === '/admin/login') return <Navigate to={(location.state as { from?: string } | null)?.from || '/admin'} replace />
  return <AuthContext.Provider value={{ owner, signOut }}><AdminShell theme={theme} onToggleTheme={onToggleTheme} /></AuthContext.Provider>
}

function ThemeSwitch({ theme, onToggle }: { theme: AdminTheme; onToggle: () => void }) {
  const { t } = useAdminLanguage()
  const label = theme === 'dark' ? t.lightMode : t.darkMode
  return <button type="button" className="admin-theme-switch" onClick={onToggle} aria-label={label} title={label}>
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {theme === 'dark' ? <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></> : <path d="M20 15.5A8.5 8.5 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z" />}
    </svg><span>{label}</span>
  </button>
}

function AdminLanguageSelector() {
  const { locale, setLocale, t } = useAdminLanguage()
  return <div className="admin-languages" role="group" aria-label={t.interfaceLanguage}>
    {(['ka', 'ru'] as const).map(code => <button key={code} type="button" lang={code} aria-pressed={locale === code} className={locale === code ? 'active' : ''} onClick={() => setLocale(code)}>{code.toUpperCase()}</button>)}
  </div>
}

function AdminLogin({ onLogin, theme, onToggleTheme }: { onLogin: (owner: Owner) => void; theme: AdminTheme; onToggleTheme: () => void }) {
  const { t, locale } = useAdminLanguage()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const location = useLocation()
  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); if (busy) return
    if (new TextEncoder().encode(password).length > 72) { setError(t.passwordLong); return }
    setBusy(true); setError(null)
    try {
      await getCsrf()
      const owner = await adminRequest<Owner>('/api/admin/auth/login', { method: 'POST', body: { email, password } })
      clearCsrf()
      setPassword(''); onLogin(owner)
    } catch (error) { setError(message(error)) } finally { setBusy(false) }
  }
  return <div className="admin-root admin-login" lang={locale} data-theme={theme}>
    <div className="admin-login-brand"><img src={logoUrl} alt="" /><span>Gio's Kebab</span><p>{t.ownerWorkspace}</p></div>
    <main className="admin-login-panel"><div className="admin-login-language"><AdminLanguageSelector /><ThemeSwitch theme={theme} onToggle={onToggleTheme} /></div><p className="admin-kicker">{t.welcome}</p><h1>{t.signIn}</h1><p className="admin-muted">{t.signInDescription}</p>
      {(location.state as { expired?: boolean } | null)?.expired && <Notice text={t.expiredSignIn} />}
      <form onSubmit={onSubmit}><label className="admin-field"><span>{t.email}</span><input autoFocus type="email" autoComplete="username" value={email} onChange={event => setEmail(event.target.value)} required maxLength={254} /></label>
        <label className="admin-field"><span>{t.password}</span><input type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} required /></label>
        <Notice text={error} /><button className="admin-button" disabled={busy} type="submit">{busy ? t.signingIn : t.signIn}</button></form>
      <Link className="admin-public-link" to="/lt">← {t.viewSite}</Link>
    </main>
  </div>
}

function AdminShell({ theme, onToggleTheme }: { theme: AdminTheme; onToggleTheme: () => void }) {
  const { owner, signOut } = useOwner()
  const { t, locale } = useAdminLanguage()
  const [logoutError, setLogoutError] = useState<string | null>(null)
  const [loggingOut, setLoggingOut] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const nav = [
    { to: '/admin', label: t.overview, end: true }, { to: '/admin/restaurant', label: t.restaurant },
    { to: '/admin/hours', label: t.hours }, { to: '/admin/menu', label: t.menu },
    { to: '/admin/promotions', label: t.promotions },
  ]
  const logout = async () => { if (loggingOut) return; setLoggingOut(true); setLogoutError(null); try { await signOut() } catch (error) { setLogoutError(message(error)); setLoggingOut(false) } }
  return <div className="admin-root" lang={locale} data-theme={theme}>
    <a className="admin-skip" href="#admin-main">{t.skipContent}</a>
    <header className="admin-top"><Link className="admin-brand" aria-label="Gio's Kebab" to="/admin" onClick={() => setMenuOpen(false)}><img src={logoUrl} alt="" /><span>Gio's Kebab <small>{t.owner}</small></span></Link>
      <div className="admin-top-actions"><AdminLanguageSelector /><ThemeSwitch theme={theme} onToggle={onToggleTheme} /><Link to="/lt" target="_blank" rel="noopener noreferrer">{t.viewSite} ↗</Link>
        <button type="button" className="admin-logout" disabled={loggingOut} onClick={logout}>
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="M10 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5M13 7l5 5-5 5M8 12h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          {loggingOut ? t.signingOut : t.signOut}</button>
        <button type="button" className="admin-mobile-toggle" aria-expanded={menuOpen} aria-controls="admin-nav" onClick={() => setMenuOpen(value => !value)}>{menuOpen ? t.closeMenu : t.menuToggle}</button></div></header>
    <div className="admin-layout"><aside id="admin-nav" className={`admin-sidebar${menuOpen ? ' open' : ''}`}><nav aria-label={t.adminNavigation}>{nav.map(item => <NavLink key={item.to} to={item.to} end={item.end} onClick={() => setMenuOpen(false)}>{item.label}</NavLink>)}</nav>
      <Link className="admin-sidebar-public" to="/lt" target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)}>{t.viewSite} ↗</Link>
      <div className="admin-account"><span>{t.signedInAs}</span><strong>{owner.email}</strong></div></aside>
      <main id="admin-main" className="admin-main" tabIndex={-1}><Notice text={logoutError} /><Outlet /></main></div>
  </div>
}
