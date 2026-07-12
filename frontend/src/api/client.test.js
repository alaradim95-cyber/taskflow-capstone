import { describe, expect, it } from 'vitest'
import { getApiErrorMessage } from './client'

describe('getApiErrorMessage', () => {
  it('formats backend field validation errors', () => {
    const error = {
      response: {
        data: {
          fieldErrors: { title: 'Title is required.', dueDate: 'Due date is invalid.' },
        },
      },
    }

    expect(getApiErrorMessage(error)).toBe('Title is required. Due date is invalid.')
  })

  it('provides a helpful message when the API is unreachable', () => {
    expect(getApiErrorMessage(new Error('Network Error'))).toContain('cannot reach the server')
  })
})
