import { NextFunction, Request, Response } from 'express'
import { HttpJsonError } from 'unicore'

const errorToObject = <T extends { toJSON?: () => any }>(err: T) =>
  err.toJSON?.() ??
  JSON.parse(JSON.stringify(err, Object.getOwnPropertyNames(err)))

const httpErrorResponder = (
  error: HttpJsonError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  res.status(error.status || 500)
  const serializedError = errorToObject(error)
  ;(res as any).out = serializedError
  res.json(serializedError)
}

export default httpErrorResponder
