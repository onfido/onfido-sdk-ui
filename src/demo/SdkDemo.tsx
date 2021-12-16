import { h, FunctionComponent } from 'preact'
import { memo, useEffect, useState } from 'preact/compat'
import {
  UIConfigs,
  getInitSdkOptions,
  queryParamToValueString,
  getTokenFactoryUrl,
  getToken,
  createCheckIfNeeded,
} from './demoUtils'
import SdkMount from './SdkMount'
import ApplicantForm from './ApplicantForm'
import io from 'socket.io-client'
import { getBackendUrl, wsPort } from '../components/utils/msvcUtils'

import type { ServerRegions, SdkOptions, SdkResponse } from '~types/sdk'
import type { ApplicantData } from './types'

const DEFAULT_REGION: ServerRegions = 'EU'

type Props = {
  hasPreview?: boolean
  messagePort?: MessagePort
  sdkOptions?: SdkOptions
  viewOptions?: UIConfigs
}
// To-Do: replace actual wsJwt PT-195
const testWsJwt =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzUxMiIsImtpZCI6ImFsaWFzL3RmLW1pY3Jvc29mdC1hdXRoZW50aWNhdG9yLWJhY2tlbmQtand0LXNpZ25pbmctY21rIn0.eyJwYXlsb2FkIjp7ImZpcnN0TmFtZSI6InRlc3QiLCJsYXN0TmFtZSI6InVzZXIiLCJjb3VudHJ5IjoiVVNBIiwicGhvbmVOdW1iZXIiOiIxMjMtNDU2LTc4OTYiLCJlbWFpbCI6InRlc3RlbWFpbEBleGFtcGxlLmNvbSIsImNhbGxiYWNrVXJsIjoiaHR0cHM6Ly9haXItYWNjZXNzLmdzay5jb20vc29tZS1wYXRoL3NvbWV0aGluZz92YWx1ZTE9dHJ1ZSZ2YWx1ZTI9c29tZS1zdHJpbmciLCJyZWx5aW5nUGFydHkiOiJtc3ZjLWdzayIsImFwcGxpY2FudElkIjoiMTMyZDE0YzMtNWMzOS00ZGRmLWFkMzgtZDAxZTgxODM0ZDQwIn0sImlhdCI6MTYzODkwNTk2MiwiZXhwIjoxNjM4OTExMzYyfQ.MIGHAkFbASNWOuIMw37R9O19h-qx3kATnm5EEfuHesWnqoRutqd5hvzz_jRq0ZOPzYkSTDO36SMexFeOUFeARyY8ChuBcwJCAI2Z6WY-ktbujFzqccTmu78ggAiF1PGg9fW_8dwdu0VuuXL2NL1tTUdfF4nwHSmyXAq2BnYAYGkVj3pGRbNpx4Zm';
const initSocket = (jwt: string) => {
  console.log('url', getBackendUrl())
  // TO-DO: update this url to be env dependent
  const socketOptions = io(`${getBackendUrl()}:${wsPort}`, {
    path: '/wss-connect',
    reconnectionAttempts: 3,
    query: { token: jwt },
  })
  socketOptions.on('connect_error', (err: Error) => {
    console.log(`connect_error due to ${JSON.stringify(err)}, ${err}`)
  })

  socketOptions.on('connect', () => {
    console.log('connected successfully')
  })

  socketOptions.emit('sdkCompleted', { jwt }, (data: string) => {
    console.log('sdk completed, response: ', data)
  })
}

const SdkDemo: FunctionComponent<Props> = ({
  hasPreview = false,
  messagePort,
  sdkOptions,
  viewOptions,
}) => {
  const [token, setToken] = useState<string | undefined>(undefined)
  const [tokenUrl, setTokenUrl] = useState<string | undefined>(undefined)
  const [regionCode, setRegionCode] = useState<ServerRegions | undefined>(
    undefined
  )
  const [applicantId, setApplicantId] = useState<string | undefined>(undefined)
  const [applicantData, setApplicantData] = useState<ApplicantData | undefined>(
    undefined
  )
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    if (queryParamToValueString.createCheck && !applicantData) {
      return
    }

    if (queryParamToValueString.showUserAnalyticsEvents) {
      window.addEventListener('userAnalyticsEvent', (event) =>
        console.info('* DEMO APP Custom User Analytics event:', event)
      )
    }

    const { region } = sdkOptions || {}

    const builtRegionCode = (
      queryParamToValueString.region ||
      region ||
      DEFAULT_REGION
    ).toUpperCase() as ServerRegions
    setRegionCode(builtRegionCode)

    const url = getTokenFactoryUrl(builtRegionCode)
    setTokenUrl(url)

    getToken(
      hasPreview,
      url,
      applicantData,
      messagePort,
      (respondedToken, responedApplicantId) => {
        setToken(respondedToken)
        setApplicantId(responedApplicantId)
      }
    )
  }, [hasPreview, applicantData, messagePort, sdkOptions])

  const onComplete = (data: SdkResponse) => {
    if (hasPreview) {
      messagePort?.postMessage({ type: 'SDK_COMPLETE', data })
      return
    }
    initSocket(testWsJwt)
    createCheckIfNeeded(tokenUrl, applicantId, data)
  }

  const { tearDown } = viewOptions || {}

  if (tearDown) {
    return <span>SDK has been torn down</span>
  }

  const options: SdkOptions = {
    ...getInitSdkOptions(),
    token,
    isModalOpen,
    onComplete,
    useMsvc: true,
    onError: (error) => console.error('onError callback:', error),
    onUserExit: (userExitCode) =>
      console.log('onUserExit callback:', userExitCode),
    onModalRequestClose: () => setIsModalOpen(false),
    ...(sdkOptions || {}),
  }

  const applicantForm = applicantData ? (
    'Loading ...'
  ) : (
    <ApplicantForm onSubmit={setApplicantData} />
  )

  return (
    <div className="container">
      {options.useModal && (
        <button id="button" type="button" onClick={() => setIsModalOpen(true)}>
          Verify identity
        </button>
      )}
      {!token && queryParamToValueString.createCheck && applicantForm}
      {token && regionCode && tokenUrl && (
        <SdkMount options={options} regionCode={regionCode} url={tokenUrl} />
      )}
    </div>
  )
}

export default memo(SdkDemo)
