import { h, Component } from 'preact'
import Raven from 'raven-js'
import {cleanFalsy, wrapArray} from '../components/utils/array'
require('script-loader!../../node_modules/wpt/wpt.js')
import mapObject from 'object-loops/map'

const RavenTracker = Raven.config('https://6e3dc0335efc49889187ec90288a84fd@sentry.io/109946')


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
   domain: 'onfido-js-sdk.com',
   cookie_name: 'onfido-js-sdk-woopra',
   cookie_domain: location.hostname,
   referer: location.href
  });

  Raven.TraceKit.collectWindowErrors = true//TODO scope exceptions to sdk code only
}

const track = () => {
  woopra.track()
  RavenTracker.install()
}

const formatProperties = properties => mapObject(properties,
  value => typeof value === 'object' ? JSON.stringify(value) : value
)

const sendEvent = (eventName, properties) =>
  woopra.track(
    eventName,
    {...formatProperties(properties), sdk_version: process.env.SDK_VERSION }
  )

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

const sendError = (message, extra) => {
  RavenTracker.captureException(new Error(message), {
    extra
  });
}

export default { setUp, track, sendError, sendEvent, sendScreen, trackComponent, trackComponentAndMode, appendToTracking }
