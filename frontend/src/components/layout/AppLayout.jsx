import { Link, NavLink, Outlet } from 'react-router-dom'

export default function AppLayout() {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <header className="site-header">
        <div className="container header-content">
          <Link className="brand" to="/tasks" aria-label="TaskFlow home">
            <span className="brand-mark" aria-hidden="true">T</span>
            <span>TaskFlow</span>
          </Link>
          <nav aria-label="Main navigation">
            <NavLink className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} to="/tasks" end>Tasks</NavLink>
            <NavLink className="button button-primary button-small" to="/tasks/new">New task</NavLink>
          </nav>
        </div>
      </header>
      <main id="main-content" className="container main-content"><Outlet /></main>
      <footer className="site-footer"><div className="container">TaskFlow · Plan clearly. Finish confidently.</div></footer>
    </div>
  )
}
