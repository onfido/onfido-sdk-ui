import { v4 as uuidv4 } from 'uuid'
const Cookies = require('js-cookie')

const cookieAttributes = {
  name: 'onfido-web-sdk-analytics',
  domain: location.hostname,
  path: '/',
  expires: 30,
  secure: true,
}

// Internal Analytics Cookie
type setAnonymousUuidFunc = (payload?: string) => void
export const setupAnalyticsCookie = (
  setAnonymousUuid: setAnonymousUuidFunc,
  anonymousUuid?: string
) => {
  const cookie = getAnalyticsCookie()

  if (!anonymousUuid && !cookie) {
    const uuid = uuidv4()
    setAnonymousUuid(uuid)
    setAnalyticsCookie(uuid)
    return
  }

  if (!anonymousUuid && cookie) {
    setAnonymousUuid(cookie)
    return
  }

  if (anonymousUuid && anonymousUuid !== cookie) {
    setAnalyticsCookie(anonymousUuid)
  }
}

const setAnalyticsCookie = (anonymousUuid: string) => {
  Cookies.set(cookieAttributes.name, anonymousUuid, cookieAttributes)
}

export const uninstallAnalyticsCookie = (
  setAnonymousUuid: setAnonymousUuidFunc
) => {
  setAnonymousUuid(undefined)
  Cookies.remove(cookieAttributes.name, cookieAttributes)
}

export const getAnalyticsCookie = () => {
  const cookie = Cookies.get(cookieAttributes.name)
  if (cookie === 'undefined') {
    return undefined
  }
  return cookie
}
