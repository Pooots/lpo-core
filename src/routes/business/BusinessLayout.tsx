import { useEffect, useMemo, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from '@tanstack/react-router'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { ChevronRight, LogOut, Menu, X } from 'lucide-react'
import type { AccountSession } from '@/types/auth'
import { BUSINESS_MODULES, businessModuleFromPath } from '@/components/business/modules'
import { cn } from '@/lib/utils'
import { ACCOUNT_LOGIN, authService } from '@/services/authService'
import { BusinessSessionProvider } from '@/routes/business/BusinessSession'
import type { ClientSession } from '@/routes/business/BusinessSession'

function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}

function isActivePath(current: string, path: string): boolean {
  if (path === '/business/account') {
    return current === '/business/account' || current === '/business/account/'
  }
  return current === path || current.startsWith(`${path}/`)
}

function Sidebar({
  pathname,
  session,
  onLogout,
  loggingOut,
  onNavigate,
}: {
  pathname: string
  session: ClientSession
  onLogout: () => void
  loggingOut: boolean
  onNavigate?: () => void
}) {
  const company = session.profile?.company_name ?? 'Your company'

  return (
    <div className="flex h-full flex-col bg-[#07101f] text-white">
      <div className="h-px bg-gradient-to-r from-transparent via-lpo-yellow to-transparent" />
      <div className="flex h-full flex-col px-5 py-6">
        <Link to="/business/account" onClick={onNavigate} className="flex items-center gap-3 px-1">
          <img src="/brand/lpo-mark.png" alt="LPO" className="size-10 rounded-xl" />
          <span className="leading-none">
            <span className="block text-[15px] font-extrabold tracking-[-0.02em]">LPO</span>
            <span className="mt-1 block text-[9px] font-bold tracking-[0.22em] text-white/40 uppercase">
              Client Office
            </span>
          </span>
        </Link>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] px-3.5 py-3">
          <p className="text-[10px] font-bold tracking-[0.18em] text-lpo-yellow/80 uppercase">Company</p>
          <p className="mt-1 truncate text-sm font-extrabold">{company}</p>
        </div>

        <p className="mt-8 mb-2 px-3 text-[10px] font-extrabold tracking-[0.22em] text-white/30 uppercase">
          Workspace
        </p>
        <nav className="space-y-1">
          {BUSINESS_MODULES.map(({ id, label, path, icon: Icon }, index) => {
            const active = isActivePath(pathname, path)
            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: 0.04 + index * 0.035 }}
              >
                <Link
                  to={path}
                  onClick={onNavigate}
                  className={cn(
                    'group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13.5px] font-bold transition-colors',
                    active ? 'text-white' : 'text-white/55 hover:bg-white/[0.04] hover:text-white',
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="business-nav-active"
                      className="absolute inset-0 rounded-xl bg-white/[0.07] ring-1 ring-white/10"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  )}
                  {active && (
                    <motion.span
                      layoutId="business-nav-bar"
                      className="absolute top-2 bottom-2 -left-5 w-[3px] rounded-r-full bg-lpo-yellow"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  )}
                  <Icon
                    className={cn(
                      'relative size-[18px]',
                      active ? 'text-lpo-yellow' : 'text-white/35 group-hover:text-white/80',
                    )}
                  />
                  <span className="relative">{label}</span>
                </Link>
              </motion.div>
            )
          })}
        </nav>

        <div className="mt-auto rounded-2xl border border-white/10 bg-white/[0.03] p-3.5">
          <div className="flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-lpo-yellow to-[#e6b000] text-sm font-extrabold text-lpo-ink">
              {initials(session.user.name)}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-bold">{session.user.name}</span>
              <span className="block truncate text-xs text-white/40">{session.user.email}</span>
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
    </div>
  )
}

export default function BusinessLayout() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [session, setSession] = useState<AccountSession | null>(() => authService.getSession())
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const current = businessModuleFromPath(pathname)

  useEffect(() => {
    let active = true
    authService
      .me()
      .then((fresh) => {
        if (!active) return
        if (fresh.type !== 'client') {
          authService.clear()
          navigate({ to: ACCOUNT_LOGIN.client, replace: true })
          return
        }
        setSession(fresh)
      })
      .catch(() => {
        if (active && !authService.isAuthenticated()) {
          navigate({ to: ACCOUNT_LOGIN.client, replace: true })
        }
      })
    return () => {
      active = false
    }
  }, [navigate])

  const logout = async () => {
    setLoggingOut(true)
    await authService.logout()
    navigate({ to: ACCOUNT_LOGIN.client, replace: true })
  }

  const contextValue = useMemo(() => {
    if (!session || session.type !== 'client') return null
    return { session, setSession: (next: AccountSession) => setSession(next) }
  }, [session])

  if (!contextValue) return null

  return (
    <BusinessSessionProvider value={contextValue}>
      <MotionConfig reducedMotion="user">
        <div className="min-h-dvh bg-[#f3f5f9]">
          <aside className="fixed inset-y-0 left-0 z-30 hidden w-[272px] lg:block">
            <Sidebar
              pathname={pathname}
              session={contextValue.session}
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
                  className="fixed inset-0 z-40 bg-[#07101f]/70 backdrop-blur-sm lg:hidden"
                />
                <motion.aside
                  key="drawer"
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', stiffness: 320, damping: 34 }}
                  className="fixed inset-y-0 left-0 z-50 w-[288px] lg:hidden"
                >
                  <button
                    type="button"
                    onClick={() => setDrawerOpen(false)}
                    aria-label="Close menu"
                    className="absolute top-5 right-4 z-10 flex size-9 items-center justify-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white"
                  >
                    <X className="size-5" />
                  </button>
                  <Sidebar
                    pathname={pathname}
                    session={contextValue.session}
                    onLogout={logout}
                    loggingOut={loggingOut}
                    onNavigate={() => setDrawerOpen(false)}
                  />
                </motion.aside>
              </>
            )}
          </AnimatePresence>

          <div className="lg:pl-[272px]">
            <header className="sticky top-0 z-20 flex h-[68px] items-center justify-between gap-4 border-b border-[#07101f]/[0.06] bg-[#f3f5f9]/85 px-5 backdrop-blur-xl sm:px-8">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  type="button"
                  onClick={() => setDrawerOpen(true)}
                  aria-label="Open menu"
                  className="flex size-9 items-center justify-center rounded-xl border border-[#07101f]/10 bg-white text-[#07101f] lg:hidden"
                >
                  <Menu className="size-5" />
                </button>
                <nav className="flex min-w-0 items-center gap-1.5 text-sm">
                  <span className="hidden font-semibold text-muted-foreground sm:inline">Client office</span>
                  <ChevronRight className="hidden size-4 text-muted-foreground/50 sm:block" />
                  <span className="truncate font-extrabold tracking-[-0.02em] text-lpo-ink">{current.label}</span>
                </nav>
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden text-right leading-tight sm:block">
                  <span className="block max-w-[180px] truncate text-sm font-bold text-lpo-ink">
                    {contextValue.session.profile?.company_name ?? contextValue.session.user.name}
                  </span>
                  <span className="block text-[11px] font-semibold text-muted-foreground">Client</span>
                </span>
                <span className="flex size-9 items-center justify-center rounded-full bg-[#07101f] text-xs font-extrabold text-lpo-yellow">
                  {initials(contextValue.session.user.name)}
                </span>
              </div>
            </header>

            <main className="px-5 py-8 sm:px-8 lg:py-10">
              <Outlet />
            </main>
          </div>
        </div>
      </MotionConfig>
    </BusinessSessionProvider>
  )
}
