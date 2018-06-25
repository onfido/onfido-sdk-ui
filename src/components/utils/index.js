import parseUnit from 'parse-unit'
import { h } from 'preact'
import enumerateDevices from 'enumerate-devices'
export {
  checkIfHasWebcam,
  checkIfWebcamPermissionGranted,
  detectWebcamMaxSupportedHeight,
} from './webcam'

export const functionalSwitch = (key, hash) => (hash[key] || (()=>null))()

export const getCSSValue = (expectedUnit, cssUnit) => {
  const [value, resUnit] = parseUnit(cssUnit)
  if (resUnit !== expectedUnit) {
    console.warn(`The css @value: ${cssUnit} unit is ${resUnit} but it should be ${expectedUnit}`)
  }
  return value
}
export const getCSSMilisecsValue = cssUnit => getCSSValue("ms", cssUnit)


export const wrapWithClass = (className, children) =>
  <div className={className}>{children}</div>

export const preventDefaultOnClick = callback => event => {
  event.preventDefault()
  callback()
}

// Copied from https://github.com/muaz-khan/DetectRTC/blob/master/DetectRTC.js
export const isDesktop = !(/Android|webOS|iPhone|iPad|iPod|BB10|BlackBerry|IEMobile|Opera Mini|Mobile|mobile/i.test(navigator.userAgent || ''))


export const humanizeField = (str) => {
  return str.substr(0, 1).toUpperCase() + str.substr(1).split('_').join(' ')
}
