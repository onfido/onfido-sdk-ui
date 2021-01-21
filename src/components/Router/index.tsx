import { h, FunctionComponent } from 'preact'

import { isDesktop } from '~utils'
import withCameraDetection from '../Capture/withCameraDetection'
import CrossDeviceMobileRouter from './CrossDeviceMobileRouter'
import MainRouter from './MainRouter'

import type { RouterOwnProps, RouterProps as Props } from '~types/routers'

const Router: FunctionComponent<Props> = (props) => {
  const RouterComponent = props.options.mobileFlow
    ? CrossDeviceMobileRouter
    : MainRouter

  return (
    <RouterComponent
      {...props}
      allowCrossDeviceFlow={!props.options.mobileFlow && isDesktop}
    />
  )
}

export default withCameraDetection<RouterOwnProps>(Router)
