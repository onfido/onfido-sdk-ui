const parseJwt = (token) => {
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace('-', '+').replace('_', '/')
  return JSON.parse(atob(base64))
}

export const jwtExpired = (token) => {
  const expTime = parseJwt(token).exp
  const currentTime = Date.now() / 1000 | 0
  return currentTime > expTime
}
