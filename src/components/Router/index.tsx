import { h, FunctionComponent } from 'preact'

import { useSdkOptions } from '~contexts'
import { isDesktop } from '~utils'
import withCameraDetection from '../Capture/withCameraDetection'
import CrossDeviceMobileRouter from './CrossDeviceMobileRouter'
import MainRouter from './MainRouter'

import type { ExternalRouterProps } from '~types/routers'

const Router: FunctionComponent<ExternalRouterProps> = (props) => {
  const options = useSdkOptions()
  const { mobileFlow } = options
  const RouterComponent = mobileFlow ? CrossDeviceMobileRouter : MainRouter

  return (
    <RouterComponent
      {...props}
      allowCrossDeviceFlow={!mobileFlow && isDesktop}
      options={options}
    />
  )
}

export default withCameraDetection(Router)
