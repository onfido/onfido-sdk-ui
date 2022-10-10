import { currentSeconds } from './index'
import type { UrlsConfig } from '~types/commons'
import type { EnterpriseFeatures } from '~types/enterprise'

type JWTPayload = {
  app?: string
  client_uuid?: string
  is_trial?: boolean
  ref?: string
}

type JWT = {
  exp: number
  payload: JWTPayload
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
  } catch (error: unknown) {
    console.error('Invalid token:', (error as Error).message)
  }

  return urls
}

export const getEnterpriseFeaturesFromJWT = (
  token: string
): EnterpriseFeatures => {
  try {
    const jwt = parseJwt(token)
    return jwt.enterprise_features
  } catch (error: unknown) {
    console.error('Invalid token:', (error as Error).message)
    return {}
  }
}

export const getPayloadFromJWT = (token: string): JWTPayload => {
  const payload: JWTPayload = {}

  try {
    const jwt = parseJwt(token)
    Object.assign(payload, jwt.payload)
  } catch (error: unknown) {
    console.error('Invalid token:', (error as Error).message)
  }

  return payload
}
