import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="state-panel">
      <span className="state-icon" aria-hidden="true">404</span><h1>Page not found</h1><p>The page you requested does not exist.</p>
      <Link className="button button-primary" to="/tasks">Return to tasks</Link>
    </div>
  )
}
