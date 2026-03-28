import { createBrowserRouter } from 'react-router'
import App from '../app/App.jsx'
import ErrorPage from '../common/ErrorPage.jsx'
import HomePage from '../features/home/HomePage.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> }
    ],
  },
])

export default router
