import { Link } from 'react-router-dom'
import { TASK_PRIORITIES, getOptionLabel } from '../../constants/taskOptions'
import { formatDate, isOverdue } from '../../utils/formatters'
import StatusBadge from './StatusBadge'

export default function TaskCard({ task }) {
  const overdue = isOverdue(task)
  return (
    <article className="task-card">
      <div className="task-card-topline">
        <StatusBadge status={task.status} />
        <span className={`priority priority-${task.priority?.toLowerCase()}`}>{getOptionLabel(TASK_PRIORITIES, task.priority)} priority</span>
      </div>
      <h2><Link to={`/tasks/${task.id}`}>{task.title}</Link></h2>
      <p className="task-description">{task.description || 'No description provided.'}</p>
      <dl className="task-meta">
        <div><dt>Assigned to</dt><dd>{task.assignee || 'Unassigned'}</dd></div>
        <div><dt>Due</dt><dd className={overdue ? 'overdue' : ''}>{formatDate(task.dueDate)}{overdue ? ' · Overdue' : ''}</dd></div>
      </dl>
      <Link className="text-link" to={`/tasks/${task.id}`}>View details <span aria-hidden="true">→</span></Link>
    </article>
  )
}
