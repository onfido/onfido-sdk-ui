import Raven from 'raven-js'
require('script-loader!../../node_modules/wpt/wpt.js')

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

const sendEvent = (eventName, properties) => {
  woopra.track(eventName, properties)
}

const sendError = (message, extra) => {
  RavenTracker.captureException(new Error(message), {
    extra
  });
}

export default { setUp, track, sendError, sendEvent }
