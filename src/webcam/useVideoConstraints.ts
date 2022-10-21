import { useState, useEffect } from 'preact/hooks'
import { isAndroid, isDesktop } from '~utils'

const hasMultipleFocusMode = (stream: MediaStream) => {
  const track = stream.getVideoTracks()[0]
  const capabilities = track.getCapabilities()
  // @ts-ignore
  return capabilities.focusMode && capabilities.focusMode.length > 1
}

const getDeviceId = (stream: MediaStream) => {
  const track = stream.getVideoTracks()[0]
  const settings = track.getSettings()
  return settings.deviceId
}

const stop = (stream: MediaStream) => {
  stream.getVideoTracks().forEach((track) => track.stop())
}

const getStream = () => {
  return navigator.mediaDevices.getUserMedia({
    audio: false,
    video: getConstraints(),
  })
}

const getConstraints = (deviceId?: string): MediaTrackConstraints => {
  if (isDesktop) {
    // debug for us devs
    return {
      width: 1280,
      aspectRatio: 1.33,
    }
  }
  if (isAndroid) {
    // on some phones if we don't set both width and height, the resolution is very poor, then you need to "Zoom out" when taking a picture
    return {
      deviceId,
      height: 1080,
      width: 1920,
      facingMode: 'environment',
    }
  }

  // IOS. DONT SET HEIGHT. If you do, IPhones 13 and 14 will bug and take pictures with too much brightness
  return {
    deviceId,
    width: 1920,
    facingMode: 'environment',
  }
}

/**
 *  Selects the best front camera (via deviceId) for document capture, and requests the 1920x1440 resolution.
 * @returns the Video constraints
 */
export const useVideoConstraints = (onFailure?: (error: Error) => void) => {
  const [deviceId, setDeviceId] = useState<string | undefined>()
  const [cameraSelected, setCameraSelected] = useState(false)

  useEffect(() => {
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        // We open the stream to trigger the permissions
        return getStream().then((stream) => {
          if (isAndroid) {
            // If the camera selected by the browser do not have multiple focus mode, we remove it from the list
            let candidates = devices
              .sort((a, b) => (a.label < b.label ? -1 : 1))
              .filter((device) => device.kind === 'videoinput')
              .filter((device) => device.label.includes(' 0,'))
              .map(({ deviceId }) => deviceId)

            if (!hasMultipleFocusMode(stream)) {
              const currentDeviceId = getDeviceId(stream)
              candidates = candidates.filter(
                (deviceId) => deviceId !== currentDeviceId
              )
            }
            setDeviceId(candidates[0])
          }
          stop(stream)
          setCameraSelected(true)
        })
      })
      .catch((e: Error) => {
        // Permission errors will be handled by the withPermissionsFlow.tsx
        onFailure && onFailure(e)
      })
  }, [])

  return {
    videoConstraints: cameraSelected ? getConstraints(deviceId) : undefined,
  }
}
