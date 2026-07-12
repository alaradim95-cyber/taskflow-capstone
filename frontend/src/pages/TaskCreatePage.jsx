import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getApiErrorMessage } from '../api/client'
import { createTask } from '../api/tasks'
import TaskForm from '../components/tasks/TaskForm'

export default function TaskCreatePage() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(payload) {
    setSubmitting(true)
    setError('')
    try {
      const task = await createTask(payload)
      navigate(`/tasks/${task.id}`, { state: { notice: 'Task created successfully.' } })
    } catch (requestError) {
      setError(getApiErrorMessage(requestError))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="form-page">
      <Link className="back-link" to="/tasks">← Back to tasks</Link>
      <section className="page-heading"><p className="eyebrow">Add work</p><h1>Create a task</h1><p>Capture the outcome, owner, priority, and due date.</p></section>
      <TaskForm submitting={submitting} serverError={error} onSubmit={handleSubmit} onCancel={() => navigate('/tasks')} />
    </div>
  )
}
