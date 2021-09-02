import { Request, Response } from 'express'
import * as lodash from 'lodash'

export interface AppMessage {
  user: unknown // TODO
  locale: string
  param: {
    [key: string]: string
  }
  requestBody: any
}

const getBearerToken = (authorizationHeader?: string) => {
  const [bearer, accessToken] = (authorizationHeader ?? '').split(' ')
  if (!bearer || bearer.toLowerCase() !== 'bearer') {
    return
  }
  return accessToken
}

const authenticateAccessToken = (accessToken?: string) => {
  // Direct bearer auth support
  if ((accessToken ?? '').startsWith('U_')) {
    // TODO Replace with your implementation, return user with this ID
    // const [, userId] = accessToken!.split('_')
  }
  // TODO Replace with your implementation, return the token user
  // Return user or undefined/null
  return undefined
}

export const createFromHttpRequest = async (httpContext: {
  req: Request
  res: Response
}): Promise<AppMessage> => {
  const { req } = httpContext
  const user = req.headers.authorization
    ? await authenticateAccessToken(getBearerToken(req.headers.authorization))
    : undefined
  return {
    user,
    locale: 'en', // Install i18n to getLocale() from HTTP Request,
    param: lodash.defaults({}, req.headers, req.params, req.query),
    requestBody: req.body,
  }
}
