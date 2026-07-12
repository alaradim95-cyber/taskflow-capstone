import { useCallback, useEffect, useState } from 'react'
import { getApiErrorMessage } from '../api/client'
import { listTasks } from '../api/tasks'

export default function useTasks() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadTasks = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const result = await listTasks()
      setTasks(Array.isArray(result) ? result : [])
    } catch (requestError) {
      setError(getApiErrorMessage(requestError))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Fetching data when the page mounts is the external synchronization this effect owns.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadTasks()
  }, [loadTasks])

  return { tasks, loading, error, retry: loadTasks }
}
