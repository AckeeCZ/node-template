import { HttpContext } from '../controllers/utils/httpContext'

export const hello = (context: HttpContext) => {
  return Promise.resolve({ hello: 'World', payload: context.payload })
}

export const sum = (...xs: number[]) => xs.reduce((a, b) => a + b, 0)
