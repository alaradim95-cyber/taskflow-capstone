export function formatDate(date) {
  if (!date) return 'No due date'
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`))
}

export function formatDateTime(value) {
  if (!value) return 'Not available'
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function isOverdue(task) {
  if (!task.dueDate || task.status === 'DONE') return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return new Date(`${task.dueDate}T00:00:00`) < today
}
