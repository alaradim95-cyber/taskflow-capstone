import { TASK_PRIORITIES, TASK_STATUSES } from '../../constants/taskOptions'

export default function TaskFilters({ filters, onChange, onClear }) {
  const active = filters.text || filters.status || filters.priority
  return (
    <section className="filters" aria-label="Task filters">
      <div className="field filter-search">
        <label htmlFor="task-search">Search tasks</label>
        <input id="task-search" type="search" value={filters.text} placeholder="Title, description or assignee" onChange={(event) => onChange('text', event.target.value)} />
      </div>
      <div className="field">
        <label htmlFor="status-filter">Status</label>
        <select id="status-filter" value={filters.status} onChange={(event) => onChange('status', event.target.value)}>
          <option value="">All statuses</option>
          {TASK_STATUSES.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      </div>
      <div className="field">
        <label htmlFor="priority-filter">Priority</label>
        <select id="priority-filter" value={filters.priority} onChange={(event) => onChange('priority', event.target.value)}>
          <option value="">All priorities</option>
          {TASK_PRIORITIES.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      </div>
      <button className="button button-ghost filter-clear" type="button" onClick={onClear} disabled={!active}>Clear filters</button>
    </section>
  )
}
