export const notFound = (message = 'Not found') => {
  const error: any = new Error(message)
  error.statusCode = 404
  return error
}

export const badRequest = (message = 'Bad request') => {
  const error: any = new Error(message)
  error.statusCode = 400
  return error
}

export const unauthorized = (message = 'Unauthorized') => {
  const error: any = new Error(message)
  error.statusCode = 401
  return error
}

export const forbidden = (message = 'Forbidden') => {
  const error: any = new Error(message)
  error.statusCode = 403
  return error
}
