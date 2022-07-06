import { LegacyTrackedEventNames } from '~types/tracker'
import WoopraTracker from './safeWoopra'

const client = window.location.hostname
const sdk_version = process.env.SDK_VERSION

let woopra: WoopraTracker = null

export const install = () => {
  woopra = new WoopraTracker('onfidojssdkwoopra')

  woopra.init()

  // configure tracker
  woopra.config({
    domain: process.env.WOOPRA_DOMAIN,
    cookie_name: 'onfido-js-sdk-woopra',
    cookie_domain: location.hostname,
    referer: location.href,
  })

  // Do not overwrite the woopra client if we are in the cross device client.
  // This is so we can track the original page where the user opened the SDK.
  woopra.identify(
    client.match(/^(id|id-dev)\.onfido\.com$/)
      ? { sdk_version }
      : { sdk_version, client }
  )
}

export const uninstall = () => {
  woopra && woopra.dispose()
}

export const track = (
  eventName: LegacyTrackedEventNames,
  properties: Optional<Record<string, unknown>>
) => woopra && woopra.track(eventName, properties)

export const getCookie = (): Optional<string> => (woopra ? woopra.cookie : null)

export const setCookie = (cookie: string): void => {
  if (!woopra) {
    return
  }

  const cookie_name = woopra.config('cookie_name')
  const cookie_expire = woopra.config('cookie_expire')
  const cookie_path = woopra.config('cookie_path')
  const cookie_domain = woopra.config('cookie_domain')
  woopra.docCookies.setItem(
    cookie_name,
    cookie,
    cookie_expire,
    cookie_path,
    cookie_domain
  )
  woopra.cookie = cookie
}
