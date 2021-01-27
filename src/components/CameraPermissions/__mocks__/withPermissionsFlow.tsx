import { h, FunctionComponent, ComponentType } from 'preact'
import type { WebcamProps } from 'react-webcam-onfido'

import type { CameraProps } from '~types/camera'
import type { WithTrackingProps, WithPermissionsFlowProps } from '~types/hocs'

type Props = CameraProps &
  WebcamProps &
  WithTrackingProps &
  WithPermissionsFlowProps

export default <P extends Props>(
  WrappedCamera: ComponentType<P>
): ComponentType<P> => {
  const WithPermissionFlow: FunctionComponent<P> = (props) => (
    <WrappedCamera {...props} hasGrantedPermission />
  )

  return WithPermissionFlow
}
