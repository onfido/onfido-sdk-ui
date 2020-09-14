import parseUnit from 'parse-unit'
import { h } from 'preact'
import enumerateDevices from 'enumerate-devices'

const SYSTEMS_MAPPING = {
  os: [
    { name: 'Windows Phone', codeName: 'Windows Phone', versionPrefix: 'OS' },
    { name: 'Windows', codeName: 'Win', versionPrefix: 'NT' },
    { name: 'iPhone', codeName: 'iPhone', versionPrefix: 'OS' },
    { name: 'iPad', codeName: 'iPad', versionPrefix: 'OS' },
    { name: 'Kindle', codeName: 'Silk', versionPrefix: 'Silk' },
    { name: 'Android', codeName: 'Android', versionPrefix: 'Android' },
    { name: 'PlayBook', codeName: 'PlayBook', versionPrefix: 'OS' },
    { name: 'BlackBerry', codeName: 'BlackBerry', versionPrefix: '/' },
    { name: 'Macintosh', codeName: 'Mac', versionPrefix: 'OS X' },
    { name: 'Linux', codeName: 'Linux', versionPrefix: 'rv' },
    { name: 'Palm', codeName: 'Palm', versionPrefix: 'PalmOS' },
  ],
  browser: [
    { name: 'Chrome', codeName: 'Chrome', versionPrefix: 'Chrome' },
    { name: 'Firefox', codeName: 'Firefox', versionPrefix: 'Firefox' },
    { name: 'Safari', codeName: 'Safari', versionPrefix: 'Version' },
    { name: 'Internet Explorer', codeName: 'MSIE', versionPrefix: 'MSIE' },
    { name: 'Opera', codeName: 'Opera', versionPrefix: 'Opera' },
    { name: 'BlackBerry', codeName: 'CLDC', versionPrefix: 'CLDC' },
    { name: 'Mozilla', codeName: 'Mozilla', versionPrefix: 'Mozilla' },
  ],
}

export const functionalSwitch = (key, hash) => (hash[key] || (() => null))()

export const getCSSValue = (expectedUnit, cssUnit) => {
  const [value, resUnit] = parseUnit(cssUnit)
  if (resUnit !== expectedUnit) {
    console.warn(
      `The css @value: ${cssUnit} unit is ${resUnit} but it should be ${expectedUnit}`
    )
  }
  return value
}

export const getCSSMilisecsValue = (cssUnit) => getCSSValue('ms', cssUnit)

export const wrapWithClass = (className, children) => (
  <div className={className}>{children}</div>
)

export const preventDefaultOnClick = (callback) => (event) => {
  event.preventDefault()
  callback()
}

// iPad 13 platform is 'MacIntel'
// https://stackoverflow.com/questions/58019463/how-to-detect-device-name-in-safari-on-ios-13-while-it-doesnt-show-the-correct
const isIOS =
  (/iPad|iPhone|iPod/.test(navigator.platform || '') ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) &&
  !window.MSStream

// WARN: only intended to target Safari 13.1 which has a reported bug handling enumerateDevices()
// https://bugs.webkit.org/show_bug.cgi?id=209580
export const isSafari131 = () => {
  const userAgent = navigator.userAgent
  const isSafari =
    /Safari/.test(userAgent) && /Apple Computer/.test(navigator.vendor)
  const version = userAgent
    .substring(userAgent.indexOf('Version/'), userAgent.indexOf('Safari/'))
    .trim()
  return isSafari && version.includes('13.1')
}

// WARN: use of this util and navigator.userAgent is highly discouraged unless absolutely necessary and for simple use cases
export const getUnsupportedMobileBrowserError = () => {
  console.warn(
    'getMobileOSName - use of navigator.userAgent is highly discouraged unless absolutely necessary and only for simple use cases'
  )
  const userAgent = navigator.userAgent
  if (/android/i.test(userAgent)) {
    return 'UNSUPPORTED_ANDROID_BROWSER'
  }
  if (isIOS) {
    return 'UNSUPPORTED_IOS_BROWSER'
  }
  console.error('Unable to determine mobile OS')
  return 'INTERRUPTED_FLOW_ERROR'
}

// Copied from https://github.com/muaz-khan/DetectRTC/blob/master/DetectRTC.js
export const isDesktop =
  !/Android|webOS|BB10|BlackBerry|IEMobile|Opera Mini|Mobile|mobile/i.test(
    navigator.userAgent || ''
  ) && !isIOS

const isWindows = (navigator.userAgent || '').includes('Windows')

const maxTouchPoints = navigator.maxTouchPoints || navigator.msMaxTouchPoints
const isTouchable =
  'ontouchstart' in window ||
  maxTouchPoints > 0 ||
  (window.matchMedia && matchMedia('(any-pointer: coarse)').matches)

// To detect hybrid desktop/mobile devices which have a rear facing camera such as the Surface
export const isHybrid = isWindows && isTouchable

const enumerateDevicesInternal = (onSuccess, onError) => {
  try {
    enumerateDevices().then(onSuccess).catch(onError)
  } catch (exception) {
    onError(exception)
  }
}

const checkDevicesInfo = (checkFn) => (onResult) =>
  enumerateDevicesInternal(
    (devices) => onResult(checkFn(devices)),
    () => onResult(false)
  )

// HACK: isMediaInputDevice function is only intended as a workaround for
//       Safari 13.1 bug that incorrectly returns a "videoinput" as "audioinput"
//       on subsequent calls to enumerateDevices()
//       https://bugs.webkit.org/show_bug.cgi?id=209580
const isMediaInputDevice = ({ kind = '' }) => kind.includes('input')
const isVideoDevice = ({ kind = '' }) => kind.includes('video')

const hasDevicePermission = ({ label }) => !!label

export const checkIfHasWebcam = checkDevicesInfo((devices) => {
  if (isSafari131()) {
    return devices.every(isMediaInputDevice)
  }
  return devices.some(isVideoDevice)
})

export const checkIfWebcamPermissionGranted = checkDevicesInfo((devices) =>
  devices.filter(isMediaInputDevice).some(hasDevicePermission)
)

export const parseTags = (str, handleTag) => {
  const parser = new DOMParser()
  const stringToXml = parser.parseFromString(`<l>${str}</l>`, 'application/xml')
  const xmlToNodesArray = Array.from(stringToXml.firstChild.childNodes)
  return xmlToNodesArray.map((node) =>
    node.nodeType === document.TEXT_NODE
      ? node.textContent
      : handleTag({ type: node.tagName, text: node.textContent })
  )
}

export const currentSeconds = () => Math.floor(Date.now() / 1000)

export const currentMilliseconds = () => new Date().getTime()

export const copyToClipboard = (mobileUrl, callback) => {
  const tempInput = document.createElement('input')
  document.body.appendChild(tempInput)
  tempInput.setAttribute('value', mobileUrl)
  tempInput.select()
  document.execCommand('copy')
  document.body.removeChild(tempInput)
  callback()
}

export const addDeviceRelatedProperties = (sdkMetadata, isCrossDeviceFlow) => ({
  ...sdkMetadata,
  isCrossDeviceFlow,
  deviceType: isDesktop ? 'desktop' : 'mobile',
})

export const extractSystemInfo = (systemType) => {
  const userAgent = [
    window.navigator.platform,
    window.navigator.userAgent,
    window.navigator.appVersion,
    window.navigator.vendor,
    window.opera,
  ].join(' ')

  const matchedSystems = SYSTEMS_MAPPING[systemType].map(
    ({ codeName, name, versionPrefix }) => {
      const codeNameRegex = new RegExp(codeName, 'gi')

      // No system codeNames found
      if (!codeNameRegex.test(userAgent)) {
        return null
      }

      const versionRegex = new RegExp(
        `${versionPrefix}[-\\s\\/:;]([\\d\\._]+)`,
        'i'
      )
      const matches = userAgent.match(versionRegex)
      const version =
        matches && matches[1] ? matches[1].split(/[._]+/).join('.') : '0'

      return {
        name,
        version,
      }
    }
  )

  // Get the first non-nullish object
  return matchedSystems.filter((el) => el)[0]
}
