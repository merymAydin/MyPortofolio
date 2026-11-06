import { NavLink, Outlet } from 'react-router-dom'
import { ROUTES } from '../../app/routePaths.js'
import '../../styles/components/layout.css'

const navigation = [
  { to: ROUTES.author, label: 'The Author' },
  { to: ROUTES.laboratory, label: 'The Laboratory' },
  { to: ROUTES.caseFiles, label: 'Case Files' },
  { to: ROUTES.chronicles, label: 'The Chronicles' },
  { to: ROUTES.correspondence, label: 'Correspondence' },
]

/**
 * Shared page shell. Provides the skip link, site header/navigation,
 * the routed page outlet, and a footer.
 */
export default function Layout() {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <header className="site-header">
        <p className="site-header__title">
          <NavLink to={ROUTES.home}>The Forgotten Archives</NavLink>
        </p>

        <nav aria-label="Primary">
          <ul className="site-nav">
            {navigation.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  className={({ isActive }) =>
                    isActive ? 'site-nav__link site-nav__link--active' : 'site-nav__link'
                  }
                  to={to}
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="site-main" id="main-content" tabIndex="-1">
        <Outlet />
      </main>

      <footer className="site-footer">
        <p>The Forgotten Archives — a portfolio in progress.</p>
      </footer>
    </div>
  )
}
