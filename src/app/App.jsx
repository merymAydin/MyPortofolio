import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes.jsx'

/**
 * Application root. Owns the router provider so that routing concerns
 * live in the `app` layer rather than the Vite entry file.
 */
export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
