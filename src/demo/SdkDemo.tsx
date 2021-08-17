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

import type { ServerRegions, SdkOptions, SdkResponse } from '~types/sdk'
import type { ApplicantData } from './types'

const DEFAULT_REGION: ServerRegions = 'EU'

type Props = {
  hasPreview?: boolean
  messagePort?: MessagePort
  sdkOptions?: SdkOptions
  viewOptions?: UIConfigs
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

    console.log('Complete with data!', data)
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
