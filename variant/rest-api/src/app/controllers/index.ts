import { RequestHandler } from 'express'
import * as express from 'express'
import {
  cors as createCors,
  defaultFinalHandler,
  defaultRootHandler,
  jsonParser,
} from 'unicore'
import * as asyncHooks from 'async_hooks'
import * as appMessage from './appMessage'
import * as healthz from './healthz'
import httpErrorResponder from './httpError'
import * as openapi from '../../openapi'
import config from '../../config'

/** CLS to hold request app message context */
const als = new asyncHooks.AsyncLocalStorage<{
  appMessage?: appMessage.AppMessage
}>()

export const setAppMessage = (m: appMessage.AppMessage, cb: () => void) => {
  als.run({ appMessage: m }, cb)
}

export const getAppMessage = <
  TRequestBody = appMessage.AppMessage['requestBody']
>() =>
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  als.getStore()!.appMessage! as Omit<appMessage.AppMessage, 'requestBody'> & {
    requestBody: TRequestBody
  }

/**
 * getOasRouteAppMessage similar to getAppMessage, but allows you to
 * pass openapi route to get the typed request params and requestBody.
 *
 * Usage: getOasRouteAppMessage<openapi.paths['/api/v1/users/{id}']>()
 */
export const getOasPathAppMessage = <TOpenAPIRoute>() => {
  const { requestBody, param, ...message } = getAppMessage()
  return {
    ...message,
    requestBody: requestBody as openapi.OpenAPIRouteRequestBody<TOpenAPIRoute>,
    param: param as openapi.OpenAPIRouteParam<TOpenAPIRoute>,
  }
}

/**
 * service creates an express middleware that makes AppMessage available
 * for given serviceHandler, which is resolved and its value serialized
 * to HTTP response
 *
 * It is a single-purpose thin controller, don't hesitate to create alternatives
 * for your needs, such as `serviceMeta` below, or special cases like image upload.
 */
export const service = (
  serviceHandler: (appMessage: appMessage.AppMessage) => PromiseLike<any>
): RequestHandler =>
  pipeMiddleware(createAppMessage(), async (req, res, next) => {
    try {
      const responseBody = await serviceHandler(getAppMessage())
      res.json(responseBody)
    } catch (error) {
      next(error)
    }
  })

/**
 * Similar to `service`, but allows to set meta info from service handler return value, that is added to headers
 **/
export const serviceMeta = (
  serviceHandler: (
    appMessage: appMessage.AppMessage
  ) => PromiseLike<{ data: any; meta?: { xTotalCount?: number } }>
) =>
  pipeMiddleware(createAppMessage(), async (req, res, next) => {
    try {
      const response = await serviceHandler(getAppMessage())
      // X-Total-Count
      if (
        response.meta?.xTotalCount &&
        !isNaN(Number(response.meta.xTotalCount))
      ) {
        res.set('X-Total-Count', String(response.meta.xTotalCount))
      }
      res.json(response.data)
    } catch (error) {
      next(error)
    }
  })

/**
 * pipeMiddleware takes multiple middlewares and creates and merges them into
 * one using express Router.
 */
const pipeMiddleware = (...middlewares: RequestHandler[]) => {
  const router = express.Router({ mergeParams: true })
  middlewares.forEach(m => router.use(m))
  return router
}

/**
 * createAppMessage is an express middleware that makes getAppMessage available
 * in any of next middlewares
 */
const createAppMessage = (): RequestHandler => {
  return async (req, res, next) => {
    try {
      const m = await appMessage.createFromHttpRequest({ req, res })
      setAppMessage(m, () => next())
    } catch (error) {
      next(error)
    }
  }
}

// "*" is checked by cors package only if its a single value
const allowedCorsOrigins = config.server.corsOrigins.includes(',')
  ? config.server.corsOrigins
      .split(',')
      .filter(x => x)
      .map(x => x.trim())
      .filter(x => x)
  : config.server.corsOrigins

/**
 * ctrl is a scoped object for controller functions
 */
export const ctrl = {
  json: pipeMiddleware(
    jsonParser(),
    // Monkeypatch res.json to assign the body to res.out first in order
    // to log it by cosmas
    (_req, res, next) => {
      const resJson = res.json.bind(res)
      res.json = (body?: any) => {
        ;(res as any).out = body
        return resJson(body)
      }
      next()
    }
  ),
  cors: createCors({
    origin: allowedCorsOrigins,
    optionsSuccessStatus: 200,
    exposedHeaders: config.server.corsHeaders
      .split(',')
      .map(x => x.trim())
      .filter(x => x),
  }),
  httpFinalHandler: defaultFinalHandler,
  httpRootHandler: defaultRootHandler,
  httpErrorHandler: httpErrorResponder,
  healthz: healthz.default,
  service,
  getAppMessage,
  setAppMessage,
  getOasPathAppMessage,
}
