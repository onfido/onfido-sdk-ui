import parseUnit from 'parse-unit'
import { h } from 'preact'
import enumerateDevices from 'enumerate-devices'

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

// iPad 13 platform is 'MacIntel'
// https://stackoverflow.com/questions/58019463/how-to-detect-device-name-in-safari-on-ios-13-while-it-doesnt-show-the-correct
let isIOS = (/iPad|iPhone|iPod/.test(navigator.platform || '') || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) && !window.MSStream

// Copied from https://github.com/muaz-khan/DetectRTC/blob/master/DetectRTC.js
export const isDesktop = !(/Android|webOS|BB10|BlackBerry|IEMobile|Opera Mini|Mobile|mobile/i.test(navigator.userAgent || '')) && !isIOS

// To detect hybrid desktop/mobile devices which have a rear facing camera such as the Surface
export async function isHybrid(facingMode = 'environment') {
  return isDesktop &&
    navigator.platform === 'Win32' &&
    await navigator.mediaDevices.getUserMedia(
      {
        video: {
          facingMode
        }
      }
    ).then(async (mediaStream) => {
      const devices = mediaStream.getTracks();
      const matches = ['back', 'rear', 'world'];
      const device = devices.find(d => matches.some(match => d.label.toLocaleLowerCase().includes(match)));
      if (device) {
        return true;
      }
      /* Weird case where getUserMedia switches user and environment cameras on some Surface tablets
      Try again with user facing mode and check for labels indicating rear facing camera */
      if (facingMode === 'environment') {
        return await isHybrid('user');
      }
      return false;
    }).catch(() => false);
}

const enumerateDevicesInternal = (onSuccess, onError) => {
  try {
    enumerateDevices().then(onSuccess).catch(onError);
  }
  catch (exception){
    onError(exception)
  }
}

const checkDevicesInfo = checkFn =>
  onResult =>
    enumerateDevicesInternal(
      devices => onResult(checkFn(devices)),
      () => onResult(false)
    )

const isVideoDevice = ({ kind = '' }) => kind.includes('video')

const hasDevicePermission = ({ label }) => !!label

export const checkIfHasWebcam = checkDevicesInfo(
  devices => devices.some(isVideoDevice)
)

export const checkIfWebcamPermissionGranted = checkDevicesInfo(
  devices => devices.filter(isVideoDevice).some(hasDevicePermission)
)

export const parseTags = (str, handleTag) => {
  const parser = new DOMParser();
  const stringToXml = parser.parseFromString(`<l>${str}</l>`, 'application/xml')
  const xmlToNodesArray = Array.from(stringToXml.firstChild.childNodes)
  return xmlToNodesArray.map(
    node => node.nodeType === document.TEXT_NODE ? node.textContent : handleTag({type: node.tagName, text: node.textContent})
  )
}

export const currentSeconds = () => Math.floor(Date.now() / 1000)

export const currentMilliseconds = () => new Date().getTime()

export const copyToClipboard = (mobileUrl, callback) => {
  let tempInput = document.createElement('input')
  document.body.appendChild(tempInput);
  tempInput.setAttribute('value', mobileUrl)
  tempInput.select()
  document.execCommand("copy")
  document.body.removeChild(tempInput)
  callback()
}

export const addDeviceRelatedProperties = (sdkMetadata, isCrossDeviceFlow) => ({
  ...sdkMetadata,
  isCrossDeviceFlow,
  deviceType: isDesktop ? 'desktop' : 'mobile'
})
