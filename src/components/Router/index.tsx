import { h, FunctionComponent } from 'preact'

import { isDesktop } from '~utils'
import withCameraDetection from '../Capture/withCameraDetection'
import CrossDeviceMobileRouter from './CrossDeviceMobileRouter'
import MainRouter from './MainRouter'

import type { ExternalRouterProps } from '~types/routers'

const Router: FunctionComponent<ExternalRouterProps> = (props) => {
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

export default withCameraDetection(Router)
