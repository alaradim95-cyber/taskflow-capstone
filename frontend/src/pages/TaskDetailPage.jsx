import { useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { getApiErrorMessage } from '../api/client'
import { deleteTask } from '../api/tasks'
import StatusBadge from '../components/tasks/StatusBadge'
import { ErrorState, LoadingState } from '../components/ui/AsyncState'
import { TASK_PRIORITIES, getOptionLabel } from '../constants/taskOptions'
import useTask from '../hooks/useTask'
import { formatDate, formatDateTime, isOverdue } from '../utils/formatters'

export default function TaskDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { task, loading, error, notFound, retry } = useTask(id)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  async function handleDelete() {
    if (!window.confirm('Delete this task permanently?')) return
    setDeleting(true)
    setDeleteError('')
    try {
      await deleteTask(id)
      navigate('/tasks', { replace: true })
    } catch (requestError) {
      setDeleteError(getApiErrorMessage(requestError))
      setDeleting(false)
    }
  }

  if (loading) return <LoadingState message="Loading task…" />
  if (notFound) return <NotFoundTask />
  if (error) return <ErrorState message={error} onRetry={retry} />
  if (!task) return null

  const overdue = isOverdue(task)
  return (
    <div className="detail-page">
      <Link className="back-link" to="/tasks">← Back to tasks</Link>
      {location.state?.notice && <div className="success-banner" role="status">{location.state.notice}</div>}
      {deleteError && <div className="form-alert" role="alert">{deleteError}</div>}
      <article className="task-detail">
        <div className="detail-header">
          <div>
            <div className="task-card-topline"><StatusBadge status={task.status} /><span className={`priority priority-${task.priority?.toLowerCase()}`}>{getOptionLabel(TASK_PRIORITIES, task.priority)} priority</span></div>
            <h1>{task.title}</h1>
          </div>
          <div className="detail-actions">
            <Link className="button button-secondary" to={`/tasks/${task.id}/edit`}>Edit task</Link>
            <button className="button button-danger" type="button" onClick={handleDelete} disabled={deleting}>{deleting ? 'Deleting…' : 'Delete'}</button>
          </div>
        </div>
        <section className="detail-section"><h2>Description</h2><p className="detail-description">{task.description || 'No description provided.'}</p></section>
        <dl className="detail-grid">
          <div><dt>Assignee</dt><dd>{task.assignee || 'Unassigned'}</dd></div>
          <div><dt>Due date</dt><dd className={overdue ? 'overdue' : ''}>{formatDate(task.dueDate)}{overdue ? ' · Overdue' : ''}</dd></div>
          <div><dt>Created</dt><dd>{formatDateTime(task.createdAt)}</dd></div>
          <div><dt>Last updated</dt><dd>{formatDateTime(task.updatedAt)}</dd></div>
        </dl>
      </article>
    </div>
  )
}

function NotFoundTask() {
  return (
    <div className="state-panel">
      <span className="state-icon" aria-hidden="true">?</span><h1>Task not found</h1>
      <p>This task may have been deleted or the link may be incorrect.</p>
      <Link className="button button-primary" to="/tasks">Return to tasks</Link>
    </div>
  )
}
