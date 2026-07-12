import { useState } from 'react'
import { TASK_PRIORITIES, TASK_STATUSES } from '../../constants/taskOptions'

const EMPTY_TASK = { title: '', description: '', status: 'TODO', priority: 'MEDIUM', assignee: '', dueDate: '' }

function validate(values) {
  const errors = {}
  if (!values.title.trim()) errors.title = 'Title is required.'
  else if (values.title.trim().length > 120) errors.title = 'Title must be 120 characters or fewer.'
  if (values.description.trim().length > 1000) errors.description = 'Description must be 1,000 characters or fewer.'
  if (values.assignee.trim().length > 100) errors.assignee = 'Assignee must be 100 characters or fewer.'
  return errors
}

export default function TaskForm({ initialTask, mode = 'create', submitting, serverError, onSubmit, onCancel }) {
  const [values, setValues] = useState({ ...EMPTY_TASK, ...initialTask, dueDate: initialTask?.dueDate ?? '' })
  const [errors, setErrors] = useState({})

  function updateField(event) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    if (errors[name]) setErrors((current) => ({ ...current, [name]: '' }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const payload = {
      title: values.title.trim(),
      description: values.description.trim() || null,
      priority: values.priority,
      assignee: values.assignee.trim() || null,
      dueDate: values.dueDate || null,
    }
    if (mode === 'edit') payload.status = values.status
    onSubmit(payload)
  }

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      {serverError && <div className="form-alert" role="alert">{serverError}</div>}
      <div className="field field-full">
        <label htmlFor="title">Title <span aria-hidden="true">*</span></label>
        <input id="title" name="title" value={values.title} onChange={updateField} maxLength="120" aria-invalid={Boolean(errors.title)} aria-describedby={errors.title ? 'title-error' : undefined} disabled={submitting} autoFocus />
        <div className="field-help"><span>{errors.title && <span id="title-error" className="field-error">{errors.title}</span>}</span><span>{values.title.length}/120</span></div>
      </div>
      <div className="field field-full">
        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" value={values.description} onChange={updateField} rows="5" maxLength="1000" aria-invalid={Boolean(errors.description)} aria-describedby={errors.description ? 'description-error' : undefined} disabled={submitting} />
        <div className="field-help"><span>{errors.description && <span id="description-error" className="field-error">{errors.description}</span>}</span><span>{values.description.length}/1000</span></div>
      </div>
      {mode === 'edit' && (
        <div className="field">
          <label htmlFor="status">Status</label>
          <select id="status" name="status" value={values.status} onChange={updateField} disabled={submitting}>
            {TASK_STATUSES.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </div>
      )}
      <div className="field">
        <label htmlFor="priority">Priority</label>
        <select id="priority" name="priority" value={values.priority} onChange={updateField} disabled={submitting}>
          {TASK_PRIORITIES.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      </div>
      <div className="field">
        <label htmlFor="assignee">Assignee</label>
        <input id="assignee" name="assignee" value={values.assignee} onChange={updateField} maxLength="100" aria-invalid={Boolean(errors.assignee)} aria-describedby={errors.assignee ? 'assignee-error' : undefined} disabled={submitting} placeholder="Name or team" />
        {errors.assignee && <span id="assignee-error" className="field-error">{errors.assignee}</span>}
      </div>
      <div className="field">
        <label htmlFor="dueDate">Due date</label>
        <input id="dueDate" name="dueDate" type="date" value={values.dueDate} onChange={updateField} disabled={submitting} />
      </div>
      <div className="form-actions field-full">
        <button className="button button-primary" type="submit" disabled={submitting}>{submitting ? 'Saving…' : mode === 'edit' ? 'Save changes' : 'Create task'}</button>
        <button className="button button-secondary" type="button" onClick={onCancel} disabled={submitting}>Cancel</button>
      </div>
    </form>
  )
}
