import ReactDOM from 'react-dom/client'
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from '@tanstack/react-router'
import './styles.css'
import { AppProviders } from './AppProviders'
import reportWebVitals from './reportWebVitals'
import type { UserType } from '@/types/auth'
import HomePage from '@/routes/HomePage'
import StatusPage from '@/routes/StatusPage'
import GetStartedPage from '@/routes/GetStartedPage'
import CandidateRegisterPage from '@/routes/careers/CandidateRegisterPage'
import CandidateLoginPage from '@/routes/careers/CandidateLoginPage'
import CareersLayout from '@/routes/careers/CareersLayout'
import CareersModulePage from '@/routes/careers/CareersModulePage'
import CareersDashboardPage from '@/routes/careers/DashboardPage'
import ProfilePage from '@/routes/careers/ProfilePage'
import BusinessRegisterPage from '@/routes/business/BusinessRegisterPage'
import BusinessLoginPage from '@/routes/business/BusinessLoginPage'
import BusinessLayout from '@/routes/business/BusinessLayout'
import BusinessDashboardPage from '@/routes/business/DashboardPage'
import ContractsPage from '@/routes/business/ContractsPage'
import { LeadsPage, ReportsPage, TalentsPage as ClientTalentsPage, TasksPage } from '@/routes/business/WorkspacePages'
import AdminLoginPage from '@/routes/admin/AdminLoginPage'
import AdminLayout from '@/routes/admin/AdminLayout'
import AdminModulePage from '@/routes/admin/AdminModulePage'
import ClientsPage from '@/routes/admin/ClientsPage'
import AdminDashboardPage from '@/routes/admin/DashboardPage'
import ServicesPage from '@/routes/admin/ServicesPage'
import TalentsPage from '@/routes/admin/TalentsPage'
import { ACCOUNT_HOME, ACCOUNT_LOGIN, authService } from '@/services/authService'

document.title =
  (import.meta.env.VITE_APP_TITLE as string | undefined) ||
  'LPO — Laguna Personnel Outsourcing'

const rootRoute = createRootRoute({
  component: () => <Outlet />,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
})

const statusRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/status',
  component: StatusPage,
})

/** Signed-in users skip the sign-in / register screens of their own portal. */
function redirectIfSignedIn(type: UserType) {
  return () => {
    if (authService.getUserType() === type) {
      throw redirect({ to: ACCOUNT_HOME[type] })
    }
  }
}

function requireUserType(type: UserType) {
  return () => {
    if (authService.getUserType() !== type) {
      throw redirect({ to: ACCOUNT_LOGIN[type] })
    }
  }
}

const getStartedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/get-started',
  component: GetStartedPage,
})

const careersRegisterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/careers/register',
  beforeLoad: redirectIfSignedIn('talent'),
  component: CandidateRegisterPage,
})

const careersLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/careers/login',
  beforeLoad: redirectIfSignedIn('talent'),
  component: CandidateLoginPage,
})

const careersAccountRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/careers/account',
  beforeLoad: requireUserType('talent'),
  component: CareersLayout,
})

function careersModuleRoute<TPath extends string>(path: TPath, moduleId: string) {
  return createRoute({
    getParentRoute: () => careersAccountRoute,
    path,
    component: () => <CareersModulePage moduleId={moduleId} />,
  })
}

const businessRegisterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/business/register',
  beforeLoad: redirectIfSignedIn('client'),
  component: BusinessRegisterPage,
})

const businessLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/business/login',
  beforeLoad: redirectIfSignedIn('client'),
  component: BusinessLoginPage,
})

const businessAccountRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/business/account',
  beforeLoad: requireUserType('client'),
  component: BusinessLayout,
})

const adminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/login',
  beforeLoad: redirectIfSignedIn('admin'),
  component: AdminLoginPage,
})

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  beforeLoad: requireUserType('admin'),
  component: AdminLayout,
})

function adminModuleRoute<TPath extends string>(path: TPath, moduleId: string) {
  return createRoute({
    getParentRoute: () => adminRoute,
    path,
    component: () => <AdminModulePage moduleId={moduleId} />,
  })
}

const routeTree = rootRoute.addChildren([
  indexRoute,
  statusRoute,
  getStartedRoute,
  careersRegisterRoute,
  careersLoginRoute,
  careersAccountRoute.addChildren([
    createRoute({
      getParentRoute: () => careersAccountRoute,
      path: '/',
      component: CareersDashboardPage,
    }),
    createRoute({
      getParentRoute: () => careersAccountRoute,
      path: 'profile',
      component: ProfilePage,
    }),
    careersModuleRoute('contract', 'contract'),
    careersModuleRoute('work-diary', 'work-diary'),
    careersModuleRoute('payout', 'payout'),
    careersModuleRoute('attendance', 'attendance'),
  ]),
  businessRegisterRoute,
  businessLoginRoute,
  businessAccountRoute.addChildren([
    createRoute({
      getParentRoute: () => businessAccountRoute,
      path: '/',
      component: BusinessDashboardPage,
    }),
    createRoute({
      getParentRoute: () => businessAccountRoute,
      path: 'leads',
      component: LeadsPage,
    }),
    createRoute({
      getParentRoute: () => businessAccountRoute,
      path: 'contracts',
      component: ContractsPage,
    }),
    createRoute({
      getParentRoute: () => businessAccountRoute,
      path: 'talents',
      component: ClientTalentsPage,
    }),
    createRoute({
      getParentRoute: () => businessAccountRoute,
      path: 'tasks',
      component: TasksPage,
    }),
    createRoute({
      getParentRoute: () => businessAccountRoute,
      path: 'reports',
      component: ReportsPage,
    }),
  ]),
  adminLoginRoute,
  adminRoute.addChildren([
    createRoute({
      getParentRoute: () => adminRoute,
      path: '/',
      component: AdminDashboardPage,
    }),
    createRoute({
      getParentRoute: () => adminRoute,
      path: 'talents',
      component: TalentsPage,
    }),
    createRoute({
      getParentRoute: () => adminRoute,
      path: 'clients',
      component: ClientsPage,
    }),
    createRoute({
      getParentRoute: () => adminRoute,
      path: 'services',
      component: ServicesPage,
    }),
    adminModuleRoute('projects', 'projects'),
    adminModuleRoute('tasks', 'tasks'),
    adminModuleRoute('hris', 'hris'),
    adminModuleRoute('settings', 'settings'),
  ]),
])


const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('app')!

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>,
  )
}

reportWebVitals()