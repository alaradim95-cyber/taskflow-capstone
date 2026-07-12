import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getApiErrorMessage } from '../api/client'
import { updateTask } from '../api/tasks'
import TaskForm from '../components/tasks/TaskForm'
import { ErrorState, LoadingState } from '../components/ui/AsyncState'
import useTask from '../hooks/useTask'

export default function TaskEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { task, loading, error, notFound, retry } = useTask(id)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  async function handleSubmit(payload) {
    setSubmitting(true)
    setSubmitError('')
    try {
      await updateTask(id, payload)
      navigate(`/tasks/${id}`, { state: { notice: 'Task updated successfully.' } })
    } catch (requestError) {
      setSubmitError(getApiErrorMessage(requestError))
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <LoadingState message="Loading task…" />
  if (notFound) return <ErrorState message="This task does not exist." />
  if (error) return <ErrorState message={error} onRetry={retry} />

  return (
    <div className="form-page">
      <Link className="back-link" to={`/tasks/${id}`}>← Back to task</Link>
      <section className="page-heading"><p className="eyebrow">Update work</p><h1>Edit task</h1><p>Keep the task details and progress current.</p></section>
      <TaskForm mode="edit" initialTask={task} submitting={submitting} serverError={submitError} onSubmit={handleSubmit} onCancel={() => navigate(`/tasks/${id}`)} />
    </div>
  )
}
