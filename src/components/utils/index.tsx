import enumerateDevices, { DeviceData } from 'enumerate-devices'
import detectSystem from './detectSystem'
import type { SdkMetadata, ErrorNames } from '~types/commons'
import type { TrackedEnvironmentData } from '~types/tracker'
import type { TranslatedTagParser } from '~types/locales'
import { StepConfigDocument } from '~types/steps'

const parseUnit = (value: string | number): [number, string] => {
  const str = String(value)
  const num = str.match(/[\d.\-\+]*\s*(.*)/)
  return [parseFloat(str), num ? num[1] : '']
}

export const functionalSwitch = <T extends unknown>(
  key: string,
  hash: Record<string, () => T>
): T => (hash[key] || (() => null))()

export const getCSSValue = (
  expectedUnit: string,
  cssUnit: string | number
): number => {
  const [value, resUnit] = parseUnit(cssUnit)

  if (resUnit !== expectedUnit) {
    console.warn(
      `The css @value: ${cssUnit} unit is ${resUnit} but it should be ${expectedUnit}`
    )
  }

  return value
}

export const getCSSMillisecsValue = (cssUnit: string | number): number =>
  getCSSValue('ms', cssUnit)

export const preventDefaultOnClick = (callback: () => void) => (
  event: Event
): void => {
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
export const isSafari131 = (): boolean => {
  const userAgent = navigator.userAgent
  const isSafari =
    /Safari/.test(userAgent) && /Apple Computer/.test(navigator.vendor)

  const version = userAgent
    .substring(userAgent.indexOf('Version/'), userAgent.indexOf('Safari/'))
    .trim()

  return isSafari && version.includes('13.1')
}

// WARN: use of this util and navigator.userAgent is highly discouraged unless absolutely necessary and for simple use cases
export const getUnsupportedMobileBrowserError = (): ErrorNames => {
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
  (maxTouchPoints !== undefined && maxTouchPoints > 0) ||
  (typeof window.matchMedia === 'function' &&
    matchMedia('(any-pointer: coarse)').matches)

// To detect hybrid desktop/mobile devices which have a rear facing camera such as the Surface
export const isHybrid = isWindows && isTouchable

type CheckDeviceCallback = (device: DeviceData) => boolean
type CheckDevicesCallback = (devices: DeviceData[]) => boolean

const enumerateDevicesInternal = (
  onSuccess: (devices: DeviceData[]) => void,
  onError: (error: Error) => void
) => {
  try {
    enumerateDevices().then(onSuccess).catch(onError)
  } catch (exception: unknown) {
    onError(exception as Error)
  }
}

const checkDevicesInfo = (checkFn: CheckDevicesCallback) => (
  onResult: (result: boolean) => void
) =>
  enumerateDevicesInternal(
    (devices) => onResult(checkFn(devices)),
    () => onResult(false)
  )

// HACK: isMediaInputDevice function is only intended as a workaround for
//       Safari 13.1 bug that incorrectly returns a "videoinput" as "audioinput"
//       on subsequent calls to enumerateDevices()
//       https://bugs.webkit.org/show_bug.cgi?id=209580
const isMediaInputDevice: CheckDeviceCallback = ({ kind = '' }) =>
  kind.includes('input')

const isVideoDevice: CheckDeviceCallback = ({ kind = '' }) =>
  kind.includes('video')

const hasDevicePermission: CheckDeviceCallback = ({ label }) => !!label

export const checkIfHasWebcam = checkDevicesInfo((devices) => {
  if (isSafari131()) {
    return devices.every(isMediaInputDevice)
  }

  return devices.some(isVideoDevice)
})

export const checkIfWebcamPermissionGranted = checkDevicesInfo((devices) =>
  devices.filter(isMediaInputDevice).some(hasDevicePermission)
)

export const parseTags: TranslatedTagParser = (str, handleTag) => {
  const parser = new DOMParser()
  const stringToXml = parser.parseFromString(`<l>${str}</l>`, 'application/xml')
  const xmlToNodesArray = Array.from(
    stringToXml.firstChild?.childNodes || []
  ) as Element[]

  return xmlToNodesArray.map((node) => {
    const textContent = node.textContent || ''

    if (node.nodeType === document.TEXT_NODE) {
      return textContent
    }

    return handleTag({ type: node.tagName, text: textContent })
  })
}

export const currentSeconds = (): number => Math.floor(Date.now() / 1000)

export const currentMilliseconds = (): number => new Date().getTime()

export const copyToClipboard = (
  mobileUrl: string,
  callback: () => void
): void => {
  const tempInput = document.createElement('input')
  document.body.appendChild(tempInput)
  tempInput.setAttribute('value', mobileUrl)
  tempInput.select()
  document.execCommand('copy')
  document.body.removeChild(tempInput)
  callback()
}

export const addDeviceRelatedProperties = (
  sdkMetadata: SdkMetadata,
  isCrossDeviceFlow?: boolean
): SdkMetadata => {
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

export const trackedEnvironmentData = (): TrackedEnvironmentData => {
  const osInfo = detectSystem('os')
  const browserInfo = detectSystem('browser')

  return {
    ...(osInfo && { os: osInfo.name, os_version: osInfo.version }),
    ...(browserInfo && {
      browser: browserInfo.name,
      browser_version: browserInfo.version,
    }),
    device: isDesktop ? 'desktop' : 'mobile',
  }
}

export const capitalise = (string: string): string => {
  if (string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  return string
}

/**
 * Generate Base64 string from raw string to use as key in iterator
 * It's necessary to encode and unescape here is to work with non-Latin characters
 * See more: https://stackoverflow.com/a/26603875
 */
export const buildIteratorKey = (value: string | number | boolean): string =>
  btoa(unescape(encodeURIComponent(value)))
