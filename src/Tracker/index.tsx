import { h, Component, ComponentType } from 'preact'
import { BrowserClient, EventHint, Hub, Severity } from '@sentry/browser'
import { cleanFalsy, wrapArray } from '~utils/array'
import WoopraTracker from './safeWoopra'
import { map as mapObject } from '~utils/object'
import { isOnfidoHostname } from '~utils/string'

import type { TrackScreenCallback, WithTrackingProps } from '~types/hocs'
import type {
  TrackedEventNames,
  UserAnalyticsEventNames,
  UserAnalyticsEventDetail,
} from '~types/tracker'

let shouldSendEvents = false

const client = window.location.hostname
const sdk_version = process.env.SDK_VERSION
let sentryClient: BrowserClient = null
let sentryHub: Hub = null
let woopra: WoopraTracker = null

const integratorTrackedEvents = new Map<
  TrackedEventNames,
  UserAnalyticsEventNames
>([
  ['screen_welcome', 'WELCOME'],
  ['screen_document_front_capture_file_upload', 'DOCUMENT_CAPTURE_FRONT'],
  ['screen_document_front_confirmation', 'DOCUMENT_CAPTURE_CONFIRMATION_FRONT'],
  ['screen_document_back_capture_file_upload', 'DOCUMENT_CAPTURE_BACK'],
  ['screen_document_back_confirmation', 'DOCUMENT_CAPTURE_CONFIRMATION_BACK'],
  ['screen_face_selfie_intro', 'FACIAL_INTRO'],
  ['screen_face_selfie_capture', 'FACIAL_CAPTURE'],
  ['screen_face_selfie_confirmation', 'FACIAL_CAPTURE_CONFIRMATION'],
  ['screen_face_video_intro', 'VIDEO_FACIAL_INTRO'],
  ['screen_face_video_capture_step_1', 'VIDEO_FACIAL_CAPTURE_STEP_1'],
  ['screen_face_video_capture_step_2', 'VIDEO_FACIAL_CAPTURE_STEP_2'],
  ['screen_document_type_select', 'DOCUMENT_TYPE_SELECT'],
  ['screen_document_country_select', 'ID_DOCUMENT_COUNTRY_SELECT'],
  ['screen_crossDevice', 'CROSS_DEVICE_INTRO'],
  ['screen_crossDevice_crossdevice_link', 'CROSS_DEVICE_GET_LINK'],
  ['Starting upload', 'UPLOAD'],
])

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
  if (sentryClient) {
    sentryClient.close(2000).then(() => {
      sentryClient = null
      sentryHub = null
      process.exit()
    })
  }
  uninstallWoopra()
}

const uninstallWoopra = (): void => {
  woopra && woopra.dispose()
  shouldSendEvents = false
}

const install = (): void => {
  sentryClient = new BrowserClient({
    dsn: 'https://6e3dc0335efc49889187ec90288a84fd@sentry.io/109946',
    environment: process.env.NODE_ENV,
    release: sdk_version,
    debug: true,
    // TODO: Make sure the whitelisting works as expected
    whitelistUrls: [/onfido[A-z.]*\.min.js/g],
    beforeBreadcrumb: (crumb) => {
      const isOnfidoXhr =
        crumb.category === 'xhr' && isOnfidoHostname(crumb.data.url)

      const isOnfidoClick =
        crumb.category === 'ui.click' &&
        crumb.message.includes('.onfido-sdk-ui')

      const shouldReturnCrumb = isOnfidoXhr || isOnfidoClick

      return shouldReturnCrumb ? crumb : null
    },
    // @TODO: verify these mismatched options
    // autoBreadcrumbs: { console: false },
    // shouldSendCallback: () => process.env.PRODUCTION_BUILD,
  })
  sentryHub = new Hub(sentryClient)
  sentryHub.addBreadcrumb({ level: Severity.Info })

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
  eventName: UserAnalyticsEventNames,
  properties: Record<string, unknown>
): void => {
  dispatchEvent(
    new CustomEvent<UserAnalyticsEventDetail>('userAnalyticsEvent', {
      detail: { eventName, properties, isCrossDevice: false },
    })
  )
}

const sendEvent = (
  eventName: TrackedEventNames,
  properties?: Record<string, unknown>
): void => {
  if (integratorTrackedEvents.has(eventName)) {
    userAnalyticsEvent(integratorTrackedEvents.get(eventName), properties)
  }

  if (shouldSendEvents) {
    woopra && woopra.track(eventName, formatProperties(properties))
  }
}

const screeNameHierarchyFormat = (
  screeNameHierarchy: string[]
): TrackedEventNames =>
  `screen_${cleanFalsy(screeNameHierarchy).join('_')}` as TrackedEventNames

const sendScreen = (
  screeNameHierarchy: string[],
  properties?: Record<string, unknown>
): void => sendEvent(screeNameHierarchyFormat(screeNameHierarchy), properties)

const appendToTracking = <P extends WithTrackingProps>(
  WrappedComponent: ComponentType<P>,
  ancestorScreeNameHierarchy?: string
): ComponentType<P> =>
  class TrackedComponent extends Component<P> {
    trackScreen: TrackScreenCallback = (
      screenNameHierarchy: string | string[],
      ...others
    ) =>
      this.props.trackScreen(
        [
          ...wrapArray(ancestorScreeNameHierarchy),
          ...wrapArray(screenNameHierarchy),
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

const trackComponentMode = <P extends WithTrackingProps>(
  WrappedComponent: ComponentType<P>,
  propKey: keyof P
): ComponentType<P> =>
  class TrackedComponentWithMode extends Component<P> {
    componentDidMount() {
      this.trackScreen(this.props)
    }

    trackScreen(props: P) {
      const propValue = props[propKey]
      propValue
        ? this.props.trackScreen(propKey as string, { [propKey]: propValue })
        : this.props.trackScreen()
    }

    componentWillReceiveProps(nextProps: P) {
      if (this.props[propKey] !== nextProps[propKey]) {
        this.trackScreen(nextProps)
      }
    }

    render = () => <WrappedComponent {...this.props} />
  }

const trackComponentAndMode = <P extends WithTrackingProps>(
  WrappedComponent: ComponentType<P>,
  screenName: string,
  propKey: keyof P
): ComponentType<P> =>
  appendToTracking(trackComponentMode(WrappedComponent, propKey), screenName)

const trackException = (message: string, extra?: EventHint): void => {
  sentryHub.captureException(new Error(message), extra)
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

export {
  setUp,
  install,
  uninstall,
  uninstallWoopra,
  trackException,
  sendEvent,
  sendScreen,
  trackComponent,
  trackComponentAndMode,
  appendToTracking,
  setWoopraCookie,
  getWoopraCookie,
}
