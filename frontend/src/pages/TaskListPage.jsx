import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import TaskCard from '../components/tasks/TaskCard'
import TaskFilters from '../components/tasks/TaskFilters'
import { EmptyState, ErrorState, LoadingState } from '../components/ui/AsyncState'
import useTasks from '../hooks/useTasks'

export default function TaskListPage() {
  const { tasks, loading, error, retry } = useTasks()
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = {
    text: searchParams.get('text') ?? '',
    status: searchParams.get('status') ?? '',
    priority: searchParams.get('priority') ?? '',
  }

  const filteredTasks = useMemo(() => {
    const query = filters.text.trim().toLowerCase()
    return tasks.filter((task) => {
      const searchable = `${task.title} ${task.description ?? ''} ${task.assignee ?? ''}`.toLowerCase()
      return (!query || searchable.includes(query))
        && (!filters.status || task.status === filters.status)
        && (!filters.priority || task.priority === filters.priority)
    })
  }, [tasks, filters.text, filters.status, filters.priority])

  function changeFilter(key, value) {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    setSearchParams(next, { replace: true })
  }

  const hasFilters = Boolean(filters.text || filters.status || filters.priority)

  return (
    <div>
      <section className="page-heading heading-with-action">
        <div><p className="eyebrow">Your workspace</p><h1>Tasks</h1><p>Keep priorities visible and move work forward.</p></div>
        <Link className="button button-primary" to="/tasks/new">Create task</Link>
      </section>
      <TaskFilters filters={filters} onChange={changeFilter} onClear={() => setSearchParams({}, { replace: true })} />
      {loading && <LoadingState />}
      {!loading && error && <ErrorState message={error} onRetry={retry} />}
      {!loading && !error && filteredTasks.length === 0 && <EmptyState filtered={hasFilters} />}
      {!loading && !error && filteredTasks.length > 0 && (
        <>
          <p className="results-count" aria-live="polite">Showing {filteredTasks.length} of {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}</p>
          <section className="task-grid" aria-label="Task results">{filteredTasks.map((task) => <TaskCard key={task.id} task={task} />)}</section>
        </>
      )}
    </div>
  )
}
