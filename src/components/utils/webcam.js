import enumerateDevices from 'enumerate-devices'

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

const { mediaDevices = {} } = navigator;
const { getUserMedia = () => Promise.reject() } = mediaDevices;
const noop = () => {}

export const detectWebcamMaxSupportedHeight = heights =>
  heights.reduce((promise, height) =>
    promise.then(maxSupportedHeight =>
      getUserMedia.call(mediaDevices, { video: { height }, audio: false }, noop, noop)
        .then(stream => {
          [...stream.getVideoTracks(), ...stream.getAudioTracks()].forEach(track => track.stop())
          return height;
        })
        .catch(() => maxSupportedHeight)
    )
  , Promise.resolve(undefined))
