import { currentSeconds } from './index'
import type { UrlsConfig } from '~types/commons'
import type { EnterpriseFeatures } from '~types/enterprise'

type JWT = {
  exp: number
  payload: {
    app: string
    ref: string
  }
  uuid: string
  enterprise_features: EnterpriseFeatures
  urls: UrlsConfig
}

export const parseJwt = (token?: string): JWT => {
  if (!token) {
    throw new Error('Token undefined')
  }

  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace('-', '+').replace('_', '/')
  return JSON.parse(atob(base64))
}

export const jwtExpired = (token: string): boolean => {
  const { exp: expiresAt } = parseJwt(token)
  return currentSeconds() > expiresAt
}

export const getUrlsFromJWT = (token: string): UrlsConfig => {
  const urls: UrlsConfig = {}

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
    return {}
  }
}
