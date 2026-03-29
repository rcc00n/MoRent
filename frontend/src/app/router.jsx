import { createBrowserRouter } from 'react-router-dom'

import AppLayout from './AppLayout'
import About from '../pages/About'
import Catalog from '../pages/Catalog'
import CarPage from '../pages/CarPage'
import Contacts from '../pages/Contacts'
import FAQ from '../pages/FAQ'
import Home from '../pages/Home'
import HowItWorks from '../pages/HowItWorks'
import Privacy from '../pages/Privacy'
import RequestReceived from '../pages/RequestReceived'
import Terms from '../pages/Terms'

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
        element: <Catalog />,
      },
      {
        path: 'how-it-works',
        element: <HowItWorks />,
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: 'contacts',
        element: <Contacts />,
      },
      {
        path: 'faq',
        element: <FAQ />,
      },
      {
        path: 'terms',
        element: <Terms />,
      },
      {
        path: 'privacy',
        element: <Privacy />,
      },
      {
        path: 'request-received',
        element: <RequestReceived />,
      },
      {
        path: 'car/:id',
        element: <CarPage />,
      },
    ],
  },
])

export default router
