import parseUnit from 'parse-unit'
import { h } from 'preact'
import enumerateDevices from 'enumerate-devices'
import detectSystem from './detectSystem'

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

export const addDeviceRelatedProperties = (sdkMetadata, isCrossDeviceFlow) => {
  const osInfo = detectSystem('os')
  const browserInfo = detectSystem('browser')

  const system = {
    ...(osInfo && { os: osInfo.name, os_version: osInfo.version }),
    ...(browserInfo && {
      browser: browserInfo.name,
      browser_version: browserInfo.version,
    }),
  }

  return {
    ...sdkMetadata,
    isCrossDeviceFlow,
    deviceType: isDesktop ? 'desktop' : 'mobile',
    system,
  }
}

export const capitalise = (string) => {
  if (string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  return string
}

export const hasOnePreselectedDocument = (steps) =>
  getEnabledDocuments(steps).length === 1

export const getEnabledDocuments = (steps) => {
  const documentStep = steps.find((step) => step.type === 'document')
  const docTypes =
    documentStep && documentStep.options && documentStep.options.documentTypes
  return docTypes ? Object.keys(docTypes).filter((type) => docTypes[type]) : []
}

/**
 * Generate Base64 string from raw string to use as key in iterator
 * It's necessary to encode and unescape here is to work with non-Latin characters
 * See more: https://stackoverflow.com/a/26603875
 */
export const buildIteratorKey = (value) =>
  btoa(unescape(encodeURIComponent(value)))
