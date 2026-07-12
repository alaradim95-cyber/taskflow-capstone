import { TASK_STATUSES, getOptionLabel } from '../../constants/taskOptions'

export default function StatusBadge({ status }) {
  return <span className={`badge status-${status?.toLowerCase()}`}>{getOptionLabel(TASK_STATUSES, status)}</span>
}
