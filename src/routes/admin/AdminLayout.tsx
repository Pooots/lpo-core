import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from '@tanstack/react-router'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { ChevronRight, LogOut, Menu, X } from 'lucide-react'
import type { AccountSession } from '@/types/auth'
import { ADMIN_MODULES } from '@/components/admin/modules'
import { cn } from '@/lib/utils'
import { ACCOUNT_LOGIN, authService } from '@/services/authService'

function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}

function isActivePath(current: string, path: string): boolean {
  return path === '/admin' ? current === '/admin' || current === '/admin/' : current.startsWith(path)
}

function SidebarNav({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="space-y-1">
      {ADMIN_MODULES.map(({ id, label, path, icon: Icon }, i) => {
        const active = isActivePath(pathname, path)
        return (
          <motion.div
            key={id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.05 + i * 0.04 }}
          >
            <Link
              to={path}
              onClick={onNavigate}
              className={cn(
                'group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-bold transition-colors',
                active ? 'text-white' : 'text-white/55 hover:bg-white/[0.04] hover:text-white',
              )}
            >
              {active && (
                <motion.span
                  layoutId="admin-nav-active"
                  className="absolute inset-0 rounded-xl bg-white/[0.08] ring-1 ring-white/10"
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                />
              )}
              {active && (
                <motion.span
                  layoutId="admin-nav-bar"
                  className="absolute top-2 bottom-2 -left-3 w-1 rounded-r-full bg-lpo-yellow"
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                />
              )}
              <Icon
                className={cn(
                  'relative size-[18px] transition-colors',
                  active ? 'text-lpo-yellow' : 'text-white/40 group-hover:text-white/80',
                )}
              />
              <span className="relative">{label}</span>
            </Link>
          </motion.div>
        )
      })}
    </nav>
  )
}

function Sidebar({
  pathname,
  session,
  onLogout,
  loggingOut,
  onNavigate,
}: {
  pathname: string
  session: AccountSession
  onLogout: () => void
  loggingOut: boolean
  onNavigate?: () => void
}) {
  return (
    <div className="flex h-full flex-col bg-[#070b16] px-5 py-6 text-white">
      <Link to="/admin" onClick={onNavigate} className="flex items-center gap-3 px-1">
        <img src="/brand/lpo-mark.png" alt="LPO" className="size-10 rounded-xl" />
        <span className="leading-none">
          <span className="block text-base font-extrabold">LPO</span>
          <span className="mt-1 block text-[9px] font-bold tracking-[0.2em] text-white/45 uppercase">
            Admin Console
          </span>
        </span>
      </Link>

      <p className="mt-9 mb-3 px-3 text-[10px] font-extrabold tracking-[0.22em] text-white/30 uppercase">
        Modules
      </p>
      <SidebarNav pathname={pathname} onNavigate={onNavigate} />

      <div className="mt-auto rounded-2xl border border-white/10 bg-white/[0.03] p-3.5">
        <div className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-lpo-yellow text-sm font-extrabold text-lpo-ink">
            {initials(session.user.name)}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-bold">{session.user.name}</span>
            <span className="block truncate text-xs text-white/45">{session.user.email}</span>
          </span>
        </div>
        <button
          type="button"
          onClick={onLogout}
          disabled={loggingOut}
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 py-2 text-sm font-bold text-white/70 transition-colors hover:border-rose-400/40 hover:bg-rose-500/10 hover:text-rose-200 disabled:opacity-60"
        >
          <LogOut className="size-4" />
          {loggingOut ? 'Signing out…' : 'Sign out'}
        </button>
      </div>
    </div>
  )
}

export default function AdminLayout() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [session, setSession] = useState<AccountSession | null>(() => authService.getSession())
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const current =
    ADMIN_MODULES.find((m) => isActivePath(pathname, m.path)) ?? ADMIN_MODULES[0]

  useEffect(() => {
    let active = true
    authService
      .me()
      .then((fresh) => {
        if (!active) return
        if (fresh.type !== 'admin') {
          authService.clear()
          navigate({ to: ACCOUNT_LOGIN.admin, replace: true })
          return
        }
        setSession(fresh)
      })
      .catch(() => {
        if (active && !authService.isAuthenticated()) {
          navigate({ to: ACCOUNT_LOGIN.admin, replace: true })
        }
      })
    return () => {
      active = false
    }
  }, [navigate])

  const logout = async () => {
    setLoggingOut(true)
    await authService.logout()
    navigate({ to: ACCOUNT_LOGIN.admin, replace: true })
  }

  if (!session || session.type !== 'admin') return null

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-dvh bg-[#f4f6fb]">
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-[264px] lg:block">
          <Sidebar
            pathname={pathname}
            session={session}
            onLogout={logout}
            loggingOut={loggingOut}
          />
        </aside>

        <AnimatePresence>
          {drawerOpen && (
            <>
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setDrawerOpen(false)}
                className="fixed inset-0 z-40 bg-lpo-ink/60 backdrop-blur-sm lg:hidden"
              />
              <motion.aside
                key="drawer"
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', stiffness: 320, damping: 34 }}
                className="fixed inset-y-0 left-0 z-50 w-[280px] lg:hidden"
              >
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close menu"
                  className="absolute top-6 right-4 z-10 flex size-9 items-center justify-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white"
                >
                  <X className="size-5" />
                </button>
                <Sidebar
                  pathname={pathname}
                  session={session}
                  onLogout={logout}
                  loggingOut={loggingOut}
                  onNavigate={() => setDrawerOpen(false)}
                />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        <div className="lg:pl-[264px]">
          <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-lpo-navy/[0.06] bg-white/80 px-5 backdrop-blur-xl sm:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                aria-label="Open menu"
                className="flex size-9 items-center justify-center rounded-lg border text-lpo-navy lg:hidden"
              >
                <Menu className="size-5" />
              </button>
              <nav className="flex items-center gap-1.5 text-sm">
                <span className="font-semibold text-muted-foreground">Admin</span>
                <ChevronRight className="size-4 text-muted-foreground/60" />
                <span className="font-extrabold text-lpo-ink">{current.label}</span>
              </nav>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden text-right leading-tight sm:block">
                <span className="block text-sm font-bold text-lpo-ink">{session.user.name}</span>
                <span className="block text-[11px] font-semibold text-muted-foreground">
                  Administrator
                </span>
              </span>
              <span className="flex size-9 items-center justify-center rounded-full bg-lpo-navy text-xs font-extrabold text-white">
                {initials(session.user.name)}
              </span>
            </div>
          </header>

          <main className="px-5 py-8 sm:px-8 lg:py-10">
            <Outlet />
          </main>
        </div>
      </div>
    </MotionConfig>
  )
}
