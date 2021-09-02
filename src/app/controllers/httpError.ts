import { NextFunction, Request, Response } from 'express'
import { HttpJsonError } from 'unicore'
import config from '../../config'
import { ValidationError } from '../errors/classes'

const errorToObject = <T extends { toJSON?: () => any }>(err: T) => {
  if (!config.server.allowResponseErrors) {
    return (
      err.toJSON?.() ??
      JSON.parse(JSON.stringify(err, Object.getOwnPropertyNames(err)))
    )
  }
  if (err instanceof ValidationError) {
    const errorObj = JSON.parse(
      JSON.stringify(err, ['errorCode', 'code', 'status', 'message'])
    )

    return {
      status: errorObj?.status,
      errorCode: errorObj?.errorCode ?? errorObj?.code,
      message: errorObj?.message,
    }
  }

  const errorObj = JSON.parse(
    JSON.stringify(err, ['errorCode', 'code', 'status'])
  )

  return {
    status: errorObj?.status,
    errorCode: errorObj?.errorCode ?? errorObj?.code,
  }
}

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
