import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { listTasks } from '../api/tasks'
import { taskFixture } from '../test/fixtures'
import TaskListPage from './TaskListPage'

vi.mock('../api/tasks', () => ({ listTasks: vi.fn() }))

describe('TaskListPage', () => {
  beforeEach(() => vi.clearAllMocks())

  it('loads tasks and filters them through URL-backed controls', async () => {
    const user = userEvent.setup()
    listTasks.mockResolvedValue([
      taskFixture,
      { ...taskFixture, id: 2, title: 'Write README', priority: 'LOW', status: 'TODO', assignee: 'Alex' },
    ])
    render(<MemoryRouter><TaskListPage /></MemoryRouter>)

    expect(await screen.findByText('Prepare capstone demo')).toBeInTheDocument()
    await user.type(screen.getByLabelText('Search tasks'), 'README')

    await waitFor(() => expect(screen.queryByText('Prepare capstone demo')).not.toBeInTheDocument())
    expect(screen.getByText('Write README')).toBeInTheDocument()
    expect(screen.getByText('Showing 1 of 2 tasks')).toBeInTheDocument()
  })

  it('shows an empty state when there are no tasks', async () => {
    listTasks.mockResolvedValue([])
    render(<MemoryRouter><TaskListPage /></MemoryRouter>)
    expect(await screen.findByText('Your task list is ready')).toBeInTheDocument()
  })
})
