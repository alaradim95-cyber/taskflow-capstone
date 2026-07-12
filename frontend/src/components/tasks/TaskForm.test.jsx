import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import TaskForm from './TaskForm'

describe('TaskForm', () => {
  it('shows a validation message when the title is empty', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<TaskForm onSubmit={onSubmit} onCancel={() => {}} />)

    await user.click(screen.getByRole('button', { name: 'Create task' }))

    expect(screen.getByText('Title is required.')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('trims values and submits a create payload', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<TaskForm onSubmit={onSubmit} onCancel={() => {}} />)

    await user.type(screen.getByLabelText(/title/i), '  Ship TaskFlow  ')
    await user.type(screen.getByLabelText(/assignee/i), '  Momo  ')
    await user.selectOptions(screen.getByLabelText(/priority/i), 'HIGH')
    await user.click(screen.getByRole('button', { name: 'Create task' }))

    expect(onSubmit).toHaveBeenCalledWith({
      title: 'Ship TaskFlow', description: null, priority: 'HIGH', assignee: 'Momo', dueDate: null,
    })
  })
})
