import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { getTask } from '../api/tasks'
import { taskFixture } from '../test/fixtures'
import TaskDetailPage from './TaskDetailPage'

vi.mock('../api/tasks', () => ({ getTask: vi.fn(), deleteTask: vi.fn() }))

describe('TaskDetailPage', () => {
  it('renders task details returned by the API', async () => {
    getTask.mockResolvedValue(taskFixture)
    render(
      <MemoryRouter initialEntries={['/tasks/1']}>
        <Routes><Route path="/tasks/:id" element={<TaskDetailPage />} /></Routes>
      </MemoryRouter>,
    )

    expect(await screen.findByRole('heading', { name: taskFixture.title })).toBeInTheDocument()
    expect(screen.getByText(taskFixture.description)).toBeInTheDocument()
    expect(screen.getByText('Momo')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Edit task' })).toHaveAttribute('href', '/tasks/1/edit')
  })

  it('shows a not-found state for a missing task', async () => {
    getTask.mockRejectedValue({ response: { status: 404 } })
    render(
      <MemoryRouter initialEntries={['/tasks/404']}>
        <Routes><Route path="/tasks/:id" element={<TaskDetailPage />} /></Routes>
      </MemoryRouter>,
    )

    expect(await screen.findByRole('heading', { name: 'Task not found' })).toBeInTheDocument()
  })
})
