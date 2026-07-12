export function LoadingState({ message = 'Loading tasks…' }) {
  return <div className="state-panel" role="status" aria-live="polite"><span className="spinner" aria-hidden="true" /><p>{message}</p></div>
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="state-panel state-error" role="alert">
      <h2>We couldn’t load this</h2><p>{message}</p>
      {onRetry && <button className="button button-secondary" type="button" onClick={onRetry}>Try again</button>}
    </div>
  )
}

export function EmptyState({ filtered = false }) {
  return (
    <div className="state-panel">
      <span className="state-icon" aria-hidden="true">✓</span>
      <h2>{filtered ? 'No tasks match these filters' : 'Your task list is ready'}</h2>
      <p>{filtered ? 'Try changing or clearing a filter.' : 'Create your first task to start organizing your work.'}</p>
    </div>
  )
}
