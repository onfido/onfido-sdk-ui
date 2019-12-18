import { currentSeconds } from './index'

export const parseJwt = (token) => {
  let parsedJwt = null
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace('-', '+').replace('_', '/')
    parsedJwt = JSON.parse(atob(base64))
  } catch {}
  return parsedJwt
}

export const valideJwT = (token) => token && parseJwt(token)

export const jwtExpired = (token) => {
  const expTime = parseJwt(token).exp
  return currentSeconds() > expTime
}

export const fetchUrlsFromJWT = (token) => {
  const jwt = parseJwt(token) || {}
  return jwt.urls
}
