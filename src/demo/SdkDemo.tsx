import { h, FunctionComponent } from 'preact'
import { memo, useEffect, useState } from 'preact/compat'
import {
  UIConfigs,
  getInitSdkOptions,
  queryParamToValueString,
  getTokenFactoryUrl,
  getToken,
} from './demoUtils'
import SdkMount from './SdkMount'

import type { ServerRegions, SdkOptions } from '~types/sdk'

const DEFAULT_REGION: ServerRegions = 'EU'

type Props = {
  hasPreview?: boolean
  messagePort: MessagePort
  sdkOptions?: SdkOptions
  viewOptions?: UIConfigs
}

const SdkDemo: FunctionComponent<Props> = ({
  hasPreview = false,
  messagePort,
  sdkOptions,
  viewOptions,
}) => {
  const [token, setToken] = useState<string>(null)
  const [tokenUrl, setTokenUrl] = useState<string>(null)
  const [regionCode, setRegionCode] = useState<ServerRegions>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const { region } = sdkOptions || {}

    const builtRegionCode = (
      queryParamToValueString.region ||
      region ||
      DEFAULT_REGION
    ).toUpperCase() as ServerRegions
    setRegionCode(builtRegionCode)

    const url = getTokenFactoryUrl(builtRegionCode)
    setTokenUrl(url)

    getToken(hasPreview, url, messagePort, (respondedToken) =>
      setToken(respondedToken)
    )
  }, [hasPreview, messagePort, sdkOptions])

  const { tearDown } = viewOptions || {}

  if (tearDown) {
    return <span>SDK has been torn down</span>
  }

  const options: SdkOptions = {
    ...getInitSdkOptions(),
    token,
    isModalOpen,
    onComplete: (data) =>
      hasPreview
        ? messagePort.postMessage({ type: 'SDK_COMPLETE', data })
        : console.log(data),
    onError: (error) => console.error('onError callback:', error),
    onUserExit: (userExitCode) =>
      console.log('onUserExit callback:', userExitCode),
    onModalRequestClose: () => setIsModalOpen(false),
    ...(sdkOptions || {}),
  }

  return (
    <div className="container">
      {options.useModal && (
        <button id="button" type="button" onClick={() => setIsModalOpen(true)}>
          Verify identity
        </button>
      )}
      {token && (
        <SdkMount options={options} regionCode={regionCode} url={tokenUrl} />
      )}
    </div>
  )
}

export default memo(SdkDemo)
