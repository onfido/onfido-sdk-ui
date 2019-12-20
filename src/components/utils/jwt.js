import { currentSeconds } from './index'

export const parseJwt = (token) => {
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace('-', '+').replace('_', '/')
  return JSON.parse(atob(base64))
}

export const jwtExpired = (token) => {
  const expTime = parseJwt(token).exp
  return currentSeconds() > expTime
}

export const fetchUrlsFromJWT = (token) => {
  let urls = {}
  try {
    const jwt = parseJwt(token)
    urls = jwt.urls
  }
  catch (err) {
    console.error('Invalid token:', err.message)
  }
  return urls
}
