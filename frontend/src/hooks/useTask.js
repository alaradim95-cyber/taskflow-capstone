import { useCallback, useEffect, useState } from 'react'
import { getApiErrorMessage } from '../api/client'
import { getTask } from '../api/tasks'

export default function useTask(id) {
  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notFound, setNotFound] = useState(false)

  const loadTask = useCallback(async () => {
    setLoading(true)
    setError('')
    setNotFound(false)
    try {
      setTask(await getTask(id))
    } catch (requestError) {
      if (requestError?.response?.status === 404) setNotFound(true)
      else setError(getApiErrorMessage(requestError))
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    // Fetching data when the route id changes is the external synchronization this effect owns.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadTask()
  }, [loadTask])

  return { task, loading, error, notFound, retry: loadTask }
}
