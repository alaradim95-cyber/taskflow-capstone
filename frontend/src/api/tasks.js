import { apiClient } from './client'

export async function listTasks() {
  const response = await apiClient.get('/tasks')
  return response.data
}

export async function getTask(id) {
  const response = await apiClient.get(`/tasks/${id}`)
  return response.data
}

export async function createTask(task) {
  const response = await apiClient.post('/tasks', task)
  return response.data
}

export async function updateTask(id, task) {
  const response = await apiClient.put(`/tasks/${id}`, task)
  return response.data
}

export async function deleteTask(id) {
  await apiClient.delete(`/tasks/${id}`)
}
