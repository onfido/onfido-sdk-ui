import { h, Component, ComponentType } from 'preact'
import { cleanFalsy, wrapArray } from '~utils/array'
import { map as mapObject } from '~utils/object'
import * as execeptionTracking from '~core/ExceptionHandler'
import { sendAnalyticsEvent } from './onfidoTracker'
import { integratorTrackedEvents } from './trackerData'
import { v4 as uuidv4 } from 'uuid'
const Cookies = require('js-cookie')

import type { TrackScreenCallback, WithTrackingProps } from '~types/hocs'
import type { EventHint } from '~core/ExceptionHandler'
import type {
  LegacyTrackedEventNames,
  UserAnalyticsEventNames,
  UserAnalyticsEventDetail,
} from '~types/tracker'

let shouldSendEvents = false

const uninstall = (): void => {
  execeptionTracking.uninstall()
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
      properties?
    ) => {
      const trackedEventBeforeMount = this.props.trackEventBeforeMount
        ? this.props.trackEventBeforeMount()
        : undefined

      return this.props.trackScreen(
        [
          ...(ancestorScreenNameHierarchy
            ? wrapArray(ancestorScreenNameHierarchy)
            : []),
          ...(screenNameHierarchy ? wrapArray(screenNameHierarchy) : []),
        ],
        { ...properties, ...trackedEventBeforeMount?.properties }
      )
    }

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
      const trackedEventBeforeMount = this.props.trackEventBeforeMount
        ? this.props.trackEventBeforeMount()
        : undefined

      this.props.trackScreen(screenName, trackedEventBeforeMount?.properties)
    }

    render = () => <WrappedComponent {...this.props} />
  }

const trackException = (message: string, extra?: EventHint): void => {
  execeptionTracking?.captureException(
    new Error(message),
    extra as Record<string, unknown>
  )
}

const cookieAttributes = {
  name: 'onfido-web-sdk-analytics',
  domain: location.hostname,
  path: '/',
  expires: 30,
  secure: true,
}

// Internal Analytics Cookie
type setAnonymousUuidFunc = (payload?: string) => void

type setupAnalyticsCookieProps = {
  setAnonymousUuid: setAnonymousUuidFunc
  anonymousUuid?: string
  disableAnalyticsCookies?: boolean
}

const setupAnalyticsCookie = ({
  setAnonymousUuid,
  anonymousUuid,
  disableAnalyticsCookies,
}: setupAnalyticsCookieProps) => {
  const cookie = getAnalyticsCookie()

  if (!anonymousUuid && !cookie) {
    const uuid = uuidv4()
    setAnonymousUuid(uuid)

    if (!disableAnalyticsCookies) {
      setAnalyticsCookie(uuid)
    }
    return
  }

  if (!anonymousUuid && cookie) {
    setAnonymousUuid(cookie)
    return
  }

  if (anonymousUuid && anonymousUuid !== cookie && !disableAnalyticsCookies) {
    setAnalyticsCookie(anonymousUuid)
    return
  }

  if (cookie && disableAnalyticsCookies) {
    uninstallAnalyticsCookie()
  }
}

const setAnalyticsCookie = (anonymousUuid: string) => {
  Cookies.set(cookieAttributes.name, anonymousUuid, cookieAttributes)
}

const uninstallAnalyticsCookie = (setAnonymousUuid?: setAnonymousUuidFunc) => {
  setAnonymousUuid && setAnonymousUuid(undefined)
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
  install,
  uninstall,
  trackException,
  sendEvent,
  sendScreen,
  trackComponent,
  appendToTracking,
  setupAnalyticsCookie,
  uninstallAnalyticsCookie,
  getAnalyticsCookie,
}
