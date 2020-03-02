import { h, Component } from 'preact'
import { BrowserClient, Hub } from '@sentry/browser';
import {cleanFalsy, wrapArray} from '~utils/array'
import WoopraTracker from './safeWoopra'
import {sendAnalytics, formatAnalytics} from './utils'
import {map as mapObject} from '~utils/object'
import {isOnfidoHostname} from '~utils/string'

let shouldSendEvents = false

const client = window.location.hostname
const sdk_version = process.env.SDK_VERSION
let sentryClient = null
let sentryHub= null

const woopra = new WoopraTracker("onfidojssdkwoopra")

const integratorTrackedEvents = [
    'screen_welcome',
    'screen_document_front_capture_file_upload',
    'screen_document_front_confirmation',
    'screen_document_back_capture_file_upload',
    'screen_document_back_confirmation',
    'screen_face_selfie_intro',
    'screen_face_selfie_confirmation',
    'screen_face_video_intro',
    'face_video_capture_step_1',
    'face_video_capture_step_2',
    'Starting_upload',
    'Completed upload',
];

const setUp = () => {
  woopra.init()
  // configure tracker
  woopra.config({
   domain: process.env.WOOPRA_DOMAIN,
   cookie_name: 'onfido-js-sdk-woopra',
   cookie_domain: location.hostname,
   referer: location.href
  });

  // Do not overwrite the woopra client if we are in the cross device client.
  // This is so we can track the original page where the user opened the SDK.
  woopra.identify(client.match(/^(id|id-dev)\.onfido\.com$/) ?
    {sdk_version} : {sdk_version, client})
}

const uninstall = () => {
  if (sentryClient) {
    sentryClient.close(2000).then(() => {
      sentryClient = null
      sentryHub = null
      process.exit()
    })
  }
  uninstallWoopra()
}

const uninstallWoopra = () => {
  woopra.dispose()
  shouldSendEvents = false
}

const install = () => {
  sentryClient = new BrowserClient({
    dsn: 'https://6e3dc0335efc49889187ec90288a84fd@sentry.io/109946',
    environment: process.env.NODE_ENV,
    release: sdk_version,
    debug: true,
    autoBreadcrumbs: {
      console: false
    },
    // TODO: Make sure the whitelisting works as expected
    whitelistUrls: [/onfido[A-z.]*\.min.js/g],
    beforeBreadcrumb: (crumb) => {
      const isOnfidoXhr = crumb.category === 'xhr' && isOnfidoHostname(crumb.data.url)

      const isOnfidoClick = crumb.category === 'ui.click' && crumb.message.includes('.onfido-sdk-ui')

      const shouldReturnCrumb = isOnfidoXhr || isOnfidoClick

      return shouldReturnCrumb ? crumb : false
    },
    shouldSendCallback: () => process.env.PRODUCTION_BUILD
  })
  sentryHub = new Hub(sentryClient);
  sentryHub.addBreadcrumb({level: 'info'});

  shouldSendEvents = true
}

const formatProperties = properties => {
  if (!properties) return null
  return mapObject(properties,
    value => typeof value === 'object' ? JSON.stringify(value) : value
  )
}

const userAnalyticsEvent = (eventName, properties) =>
  dispatchEvent(new CustomEvent('userAnalyticsEvent', {detail: {eventName, properties}}));

const sendEvent = (eventName, eventProperties) => {
  const properties = formatProperties(eventProperties)
  const formattedEvent = formatAnalytics(woopra, eventName, properties)
  if (shouldSendEvents) {
    if (integratorTrackedEvents.includes(eventName)) {
      userAnalyticsEvent(eventName, eventProperties);
    }
    sendAnalytics(formattedEvent)
  }
}

const screeNameHierarchyFormat = (screeNameHierarchy) =>
  `screen_${cleanFalsy(screeNameHierarchy).join('_')}`

const sendScreen = (screeNameHierarchy, properties) =>
  sendEvent(screeNameHierarchyFormat(screeNameHierarchy), properties)

const appendToTracking = (Acomponent, ancestorScreeNameHierarchy) =>
  class extends Component {
    trackScreen = (screenNameHierarchy, ...others) =>
      this.props.trackScreen([
        ...wrapArray(ancestorScreeNameHierarchy),
        ...wrapArray(screenNameHierarchy)
      ], ...others)

    render = () => <Acomponent {...this.props} trackScreen={this.trackScreen}/>
  }

const trackComponent = (Acomponent, screenName) =>
  class extends Component {
    componentDidMount () { this.props.trackScreen(screenName) }
    render = () => <Acomponent {...this.props}/>
  }

const trackComponentMode = (Acomponent, propKey) =>
  class extends Component {
    componentDidMount () {
      this.trackScreen(this.props)
    }

    trackScreen(props) {
      const propValue = props[propKey]
      const params = propValue ? [propKey, {[propKey]: propValue}] : []
      this.props.trackScreen(...params)
    }

    componentWillReceiveProps(nextProps) {
      if (this.props[propKey] !== nextProps[propKey]){
        this.trackScreen(nextProps)
      }
    }

    render = () => <Acomponent {...this.props} />
  }

const trackComponentAndMode = (Acomponent, screenName, propKey) =>
  appendToTracking(trackComponentMode(Acomponent, propKey), screenName)

const trackException = (message, extra) => {
  sentryHub.captureException(new Error(message), {
    extra
  });
}

const setWoopraCookie = (cookie) => {
  const cookie_name = woopra.config('cookie_name')
  const cookie_expire = woopra.config('cookie_expire')
  const cookie_path = woopra.config('cookie_path')
  const cookie_domain = woopra.config('cookie_domain')
  woopra.docCookies.setItem(
    cookie_name, cookie, cookie_expire, cookie_path, cookie_domain
  )
  woopra.cookie = cookie
}

const getWoopraCookie = () =>
  woopra.cookie

export { setUp, install, uninstall, uninstallWoopra, trackException, sendEvent, sendScreen, trackComponent,
                 trackComponentAndMode, appendToTracking, setWoopraCookie,
                 getWoopraCookie }
