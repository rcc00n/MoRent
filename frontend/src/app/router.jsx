import { createBrowserRouter } from 'react-router-dom'

import AppLayout from './AppLayout'
import Catalog from '../pages/Catalog'
import CarPage from '../pages/CarPage'
import Home from '../pages/Home'

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
        path: 'car/:id',
        element: <CarPage />,
      },
    ],
  },
])

export default router
