export * as api from './api'

export type OpenAPIRouteRequestBody<T> = T extends { post: { requestBody: { content: { 'application/json': infer U } } } } ? U : unknown
export type OpenAPIRoutePathParam<T> = T extends { get: { parameters: { path: infer U } } } ? U : unknown
export type OpenAPIRouteQueryParam<T> = T extends { get: { parameters: { query: infer U } } } ? U : unknown
export type OpenAPIRouteHeaderParam<T> = T extends { get: { parameters: { header: infer U } } } ? U : T extends { post: { parameters: { header: infer U } } } ? U : unknown
export type OpenAPIRouteParam<T> = OpenAPIRoutePathParam<T> & OpenAPIRouteQueryParam<T> & OpenAPIRouteHeaderParam<T>
export type OpenAPIResponse<T> = T extends {
  post: { responses: { content: { 'application/json': infer U } } }
}
  ? U
  : T extends {
      get: { responses: { 200: { content: { 'application/json': infer U } } } }
    }
  ? U
  : T extends {
      get: { responses: { 200: unknown } }
    }
  ? void
  : unknown
