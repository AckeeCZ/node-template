import { ctrl } from '../controllers'
import * as openapi from '../../openapi'

export const hello = (): Promise<
  openapi.OpenAPIResponse<openapi.api.paths['/hello']>
> => {
  const message = ctrl.getOasPathAppMessage<openapi.api.paths['/hello']>()
  return Promise.resolve({ hello: 'World', payload: message.requestBody })
}

export const sum = (...xs: number[]) => xs.reduce((a, b) => a + b, 0)
