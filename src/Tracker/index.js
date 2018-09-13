import { h, Component } from 'preact'
import Raven from 'raven-js'
import {cleanFalsy, wrapArray} from '../components/utils/array'
import {isOnfidoURL, includesRegex} from '../components/utils/strings'
require('script-loader!../../node_modules/wpt/wpt.min.js')
import mapObject from 'object-loops/map'

const client = window.location.hostname
const sdk_version = process.env.SDK_VERSION

/*
Tested pass against:
/web-sdk/AC/onfido.min.js
/web-sdk/AC/onfido.crossDevice.min.js
/js/onfido.min.js

Tested fail against
/controller.onfido.min.js in e
/babc0c8cda3d7ab9dc1e16e1afb97c33de6435f3.js in e
[native code] in send
/assets/1.940a78e9cd4f54fb0ff1.js
 */
const isJSBundle = (transaction) => includesRegex(transaction, /\/onfido[A-z\.]*\.min.js/g)

const RavenTracker = Raven.config('https://6e3dc0335efc49889187ec90288a84fd@sentry.io/109946', {
  environment: process.env.NODE_ENV,
  release: sdk_version,
  debug: true,
  autoBreadcrumbs: {
    console: false
  },
  breadcrumbCallback: (crumb) => {
    if (crumb.category === 'xhr' && isOnfidoURL(crumb.data.url)) {
      return crumb;
    }
    if (crumb.category === 'ui.click' && crumb.message.includes('.onfido-sdk-ui')){
      return crumb
    }

    return false;
  },
  shouldSendCallback: (data) => {
    if (!process.env.PRODUCTION_BUILD) return true
    if (isJSBundle(data.transaction)) return true
    return false;
  }
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
