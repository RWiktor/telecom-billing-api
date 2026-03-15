import { describe, it, expect } from 'vitest'
import { notFound, badRequest, unauthorized, forbidden } from '../../utils/errors'

describe('errors', () => {
  it('notFound returns a 404 error', () => {
    const err = notFound()
    expect(err).toBeInstanceOf(Error)
    expect(err.statusCode).toBe(404)
    expect(err.message).toBe('Not found')
  })
  it('badRequest returns a 400 error', () => {
    const err = badRequest()
    expect(err.statusCode).toBe(400)
  })
  it('unauthorized returns a 401 error', () => {
    const err = unauthorized()
    expect(err.statusCode).toBe(401)
  })
  it('forbidden returns a 403 error', () => {
    const err = forbidden()
    expect(err.statusCode).toBe(403)
  })
})
