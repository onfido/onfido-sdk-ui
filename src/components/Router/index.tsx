import { h, FunctionComponent } from 'preact'

import { useSdkOptions } from '~contexts'
import { isDesktop } from '~utils'
import withCameraDetection from '../Capture/withCameraDetection'
import CrossDeviceMobileRouter from './CrossDeviceMobileRouter'
import MainRouter from './MainRouter'

import type { ExternalRouterProps } from '~types/routers'
import { FormattedError } from '~types/commons'
import { ErrorCallback, ParsedError } from '~types/api'
import { trackException } from '../../Tracker'
import { useCallback } from 'preact/hooks'

const formattedError = ({ response, status }: ParsedError): FormattedError => {
  const errorResponse = response.error || response || {}

  const isExpiredTokenError =
    status === 401 && errorResponse.type === 'expired_token'
  const type = isExpiredTokenError ? 'expired_token' : 'exception'
  // `/validate_document` returns a string only. Example: "Token has expired."
  // Ticket in backlog to update all APIs to use signature similar to main Onfido API
  const message = errorResponse.message || response.message || 'Unknown error'
  return { type, message }
}

const Router: FunctionComponent<ExternalRouterProps> = (props) => {
  const [options] = useSdkOptions()
  const { mobileFlow } = options
  const RouterComponent = mobileFlow ? CrossDeviceMobileRouter : MainRouter

  const triggerOnError: ErrorCallback = useCallback(
    ({ response, status }) => {
      if (status === 0) {
        return
      }

      const error = formattedError({ response, status })
      const { type, message } = error
      options.events?.emit('error', { type, message })
      trackException(`${type} - ${message}`)
    },
    [options.events]
  )

  return (
    <RouterComponent
      {...props}
      triggerOnError={triggerOnError}
      allowCrossDeviceFlow={!mobileFlow && isDesktop}
      options={options}
    />
  )
}

export default withCameraDetection(Router)
