import { h, Component } from 'preact'
import Raven from 'raven-js'
import {cleanFalsy, wrapArray} from '../components/utils/array'
require('imports-loader?this=>window!wpt/wpt.min.js')
import mapObject from 'object-loops/map'
import {includes,isOnfidoHostname} from '~utils/string'

const client = window.location.hostname
const sdk_version = process.env.SDK_VERSION

const RavenTracker = Raven.config('https://6e3dc0335efc49889187ec90288a84fd@sentry.io/109946', {
  environment: process.env.NODE_ENV,
  release: sdk_version,
  debug: true,
  autoBreadcrumbs: {
    console: false
  },
  breadcrumbCallback: (crumb) => {
    const isOnfidoXhr = crumb.category === 'xhr' && isOnfidoHostname(crumb.data.url)

    const isOnfidoClick = crumb.category === 'ui.click' && includes(crumb.message,'.onfido-sdk-ui')

    const shouldReturnCrumb = isOnfidoXhr || isOnfidoClick

    return shouldReturnCrumb ? crumb : false
  },
  whitelistUrls: [/onfido[A-z\.]*\.min.js/g],
  shouldSendCallback: () => process.env.PRODUCTION_BUILD
})


//TODO change Woopra to export properly, commonjs style
//This is necessary because of the horrible way that woopra loads its trackers to the global context
//This is actuall a less horrible way,
//because the original way expects the tracker names to be inside of a global list with name __woo

//this is necessary because woopra will load a script
//that updates a key in window which has the name which is passed to WoopraTracker
const trackerName = "onfidojssdkwoopra"

const woopra = new window.WoopraTracker(trackerName)

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

  Raven.TraceKit.collectWindowErrors = true//TODO scope exceptions to sdk code only
}

const uninstall = () => {
  RavenTracker.uninstall()
}

const install = () => {
  RavenTracker.install()
}

const formatProperties = properties => {
  if (!properties) return null
  return mapObject(properties,
    value => typeof value === 'object' ? JSON.stringify(value) : value
  )
}

const sendEvent = (eventName, properties) =>
  woopra.track(eventName, formatProperties(properties))

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
  RavenTracker.captureException(new Error(message), {
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

export default { setUp, install, uninstall, trackException, sendEvent, sendScreen, trackComponent,
                 trackComponentAndMode, appendToTracking, setWoopraCookie,
                 getWoopraCookie }
