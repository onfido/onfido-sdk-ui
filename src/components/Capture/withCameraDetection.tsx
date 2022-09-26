import { h, ComponentType, FunctionComponent } from 'preact'
import { useState, useEffect } from 'preact/compat'
import { checkIfHasWebcam, isSafari131 } from '~utils'

import type { WithCameraDetectionProps } from '~types/hocs'
import type { ReduxProps } from '~types/routers'

type Props = ReduxProps & WithCameraDetectionProps

export default function withCameraDetection<P extends Props>(
  WrappedComponent: ComponentType<P>
): ComponentType<P> {
  const WithCameraDetection: FunctionComponent<P> = (props) => {
    // FIXME: hasCamera should use the type in WithCameraDetectionProps
    const [hasCamera, setHasCamera] = useState<boolean | null>(null)
    const [cameraCheckerIntervalId, setCameraCheckerIntervalId] = useState<
      number | null
    >(null)

    useEffect(() => {
      const checkCameraSupport = () =>
        checkIfHasWebcam((cameraState: boolean) => {
          if (hasCamera !== cameraState) {
            props.actions.setDeviceHasCameraSupport(cameraState)
            setHasCamera(cameraState)
          }
        })

      // HACK: use of isSafari131 util function is a workaround specifically for
      //       Safari 13.1 bug that incorrectly returns a "videoinput" as "audioinput"
      //       on subsequent calls to enumerateDevices
      //       see https://bugs.webkit.org/show_bug.cgi?id=209580
      if (!isSafari131()) {
        setCameraCheckerIntervalId(window.setInterval(checkCameraSupport, 2000))
      }
      checkCameraSupport()

      if (cameraCheckerIntervalId) {
        return clearInterval(cameraCheckerIntervalId)
      }
    }, [hasCamera]) // eslint-disable-line react-hooks/exhaustive-deps
    // while checking if we have a camera or not, don't render anything
    // otherwise we'll see a flicker, after we do work out what's what
    if (hasCamera === null) return null
    return <WrappedComponent {...props} hasCamera={hasCamera} />
  }

  return WithCameraDetection
}
