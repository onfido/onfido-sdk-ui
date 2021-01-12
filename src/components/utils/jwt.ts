import { currentSeconds } from './index'
import type { EnterpriseFeatures } from '~types/enterprise'
import type { UrlsPayload } from '../ReduxAppWrapper/types'

export const parseJwt = (token: string): Record<string, unknown> => {
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace('-', '+').replace('_', '/')
  return JSON.parse(atob(base64))
}

export const jwtExpired = (token: string): boolean => {
  const expTime = parseJwt(token).exp
  return currentSeconds() > expTime
}

export const getUrlsFromJWT = (token: string): UrlsPayload => {
  const urls: UrlsPayload = {}

  try {
    const jwt = parseJwt(token)
    Object.assign(urls, jwt.urls)
  } catch (err) {
    console.error('Invalid token:', err.message)
  }

  return urls
}

export const getEnterpriseFeaturesFromJWT = (
  token: string
): EnterpriseFeatures => {
  try {
    const jwt = parseJwt(token)
    return jwt.enterprise_features
  } catch (err) {
    console.error('Invalid token:', err.message)
  }
}
