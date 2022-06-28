import { h, Component, ComponentType } from 'preact'
import { cleanFalsy, wrapArray } from '~utils/array'
import WoopraTracker from './safeWoopra'
import { map as mapObject } from '~utils/object'
import * as execeptionTracking from '~core/ExceptionHandler'
import { sendAnalyticsEvent } from './onfidoTracker'
import { integratorTrackedEvents } from './trackerData'
import { v4 as uuidv4 } from 'uuid'
const Cookies = require('js-cookie')

import type { TrackScreenCallback, WithTrackingProps } from '~types/hocs'
import type {
  LegacyTrackedEventNames,
  UserAnalyticsEventNames,
  UserAnalyticsEventDetail,
} from '~types/tracker'
import type { EventHint } from '~core/ExceptionHandler'

let shouldSendEvents = false

const client = window.location.hostname
const sdk_version = process.env.SDK_VERSION
let woopra: WoopraTracker = null

const setUp = (): void => {
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

const uninstall = (): void => {
  execeptionTracking.uninstall()
  uninstallWoopra()
}

const uninstallWoopra = (): void => {
  woopra && woopra.dispose()
  shouldSendEvents = false
}

const install = (): void => {
  execeptionTracking.install()
  shouldSendEvents = true
}

const formatProperties = (
  properties?: Record<string, unknown>
): Optional<Record<string, unknown>> => {
  if (!properties) {
    return null
  }

  return mapObject(properties, (value) =>
    typeof value === 'object' ? JSON.stringify(value) : value
  )
}

const userAnalyticsEvent = (
  eventName: UserAnalyticsEventNames | undefined,
  properties: Record<string, unknown> = {}
): void => {
  if (!eventName) {
    return
  }

  dispatchEvent(
    new CustomEvent<UserAnalyticsEventDetail>('userAnalyticsEvent', {
      detail: { eventName, properties, isCrossDevice: false },
    })
  )
}

const sendEvent = (
  eventName: LegacyTrackedEventNames,
  properties?: Record<string, unknown>
): void => {
  if (integratorTrackedEvents.has(eventName)) {
    userAnalyticsEvent(integratorTrackedEvents.get(eventName), properties)
  }

  if (shouldSendEvents) {
    const formattedProperties = formatProperties(properties)
    woopra && woopra.track(eventName, formattedProperties)
    sendAnalyticsEvent(eventName, formattedProperties)
  }
}

const screenNameHierarchyFormat = (
  screenNameHierarchy: string[]
): LegacyTrackedEventNames =>
  `screen_${cleanFalsy(screenNameHierarchy).join(
    '_'
  )}` as LegacyTrackedEventNames

const sendScreen = (
  screenNameHierarchy: string[],
  properties?: Record<string, unknown>
): void => sendEvent(screenNameHierarchyFormat(screenNameHierarchy), properties)

const appendToTracking = <P extends WithTrackingProps>(
  WrappedComponent: ComponentType<P>,
  ancestorScreenNameHierarchy?: string
): ComponentType<P> =>
  class TrackedComponent extends Component<P> {
    trackScreen: TrackScreenCallback = (
      screenNameHierarchy?: string | string[],
      ...others
    ) =>
      this.props.trackScreen(
        [
          ...(ancestorScreenNameHierarchy
            ? wrapArray(ancestorScreenNameHierarchy)
            : []),
          ...(screenNameHierarchy ? wrapArray(screenNameHierarchy) : []),
        ],
        ...others
      )

    render = () => (
      <WrappedComponent {...this.props} trackScreen={this.trackScreen} />
    )
  }

const trackComponent = <P extends WithTrackingProps>(
  WrappedComponent: ComponentType<P>,
  screenName?: string
): ComponentType<P> =>
  class TrackedComponent extends Component<P> {
    componentDidMount() {
      this.props.trackScreen(screenName)
    }

    render = () => <WrappedComponent {...this.props} />
  }

const trackException = (message: string, extra?: EventHint): void => {
  execeptionTracking?.captureException(
    new Error(message),
    extra as Record<string, unknown>
  )
}

const setWoopraCookie = (cookie: string): void => {
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

const getWoopraCookie = (): Optional<string> => (woopra ? woopra.cookie : null)

const cookieAttributes = {
  name: 'onfido-web-sdk-analytics',
  domain: location.hostname,
  path: '/',
  expires: 30,
  secure: true,
}

// Internal Analytics Cookie
type setAnonymousUuidFunc = (payload?: string) => void
const setupAnalyticsCookie = (
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

const uninstallAnalyticsCookie = (setAnonymousUuid: setAnonymousUuidFunc) => {
  setAnonymousUuid(undefined)
  Cookies.remove(cookieAttributes.name, cookieAttributes)
}

const getAnalyticsCookie = () => {
  const cookie = Cookies.get(cookieAttributes.name)
  if (cookie === 'undefined') {
    return undefined
  }
  return cookie
}

export {
  setUp,
  install,
  uninstall,
  uninstallWoopra,
  trackException,
  sendEvent,
  sendScreen,
  trackComponent,
  appendToTracking,
  setWoopraCookie,
  getWoopraCookie,
  setupAnalyticsCookie,
  uninstallAnalyticsCookie,
  getAnalyticsCookie,
}
