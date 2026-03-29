import { Suspense, lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'

import AppLayout from './AppLayout'
import Home from '../pages/Home'

const Catalog = lazy(() => import('../pages/Catalog'))
const CarPage = lazy(() => import('../pages/CarPage'))
const Contacts = lazy(() => import('../pages/Contacts'))
const FAQ = lazy(() => import('../pages/FAQ'))
const About = lazy(() => import('../pages/About'))
const Privacy = lazy(() => import('../pages/Privacy'))
const Terms = lazy(() => import('../pages/Terms'))
const HowItWorks = lazy(() => import('../pages/HowItWorks'))
const RequestReceived = lazy(() => import('../pages/RequestReceived'))

function RouteFallback() {
  return (
    <div className="loading-shell loading-shell--panel" aria-hidden="true">
      <div className="loading-line loading-line--wide"></div>
      <div className="loading-line"></div>
      <div className="loading-line loading-line--short"></div>
    </div>
  )
}

function withRouteSuspense(element) {
  return <Suspense fallback={<RouteFallback />}>{element}</Suspense>
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'catalog',
        element: withRouteSuspense(<Catalog />),
      },
      {
        path: 'how-it-works',
        element: withRouteSuspense(<HowItWorks />),
      },
      {
        path: 'about',
        element: withRouteSuspense(<About />),
      },
      {
        path: 'contacts',
        element: withRouteSuspense(<Contacts />),
      },
      {
        path: 'faq',
        element: withRouteSuspense(<FAQ />),
      },
      {
        path: 'terms',
        element: withRouteSuspense(<Terms />),
      },
      {
        path: 'privacy',
        element: withRouteSuspense(<Privacy />),
      },
      {
        path: 'request-received',
        element: withRouteSuspense(<RequestReceived />),
      },
      {
        path: 'car/:id',
        element: withRouteSuspense(<CarPage />),
      },
    ],
  },
])

export default router
