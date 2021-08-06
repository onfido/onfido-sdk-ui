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

    const { region } = sdkOptions || {}

    const builtRegionCode = (
      queryParamToValueString.region ||
      region ||
      DEFAULT_REGION
    ).toUpperCase() as ServerRegions
    setRegionCode(builtRegionCode)

    const url = getTokenFactoryUrl(builtRegionCode)
    // const url = 'http://localhost:3000/sdk-token'
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

  let options: SdkOptions

  try {
    options = {
      ...getInitSdkOptions(),
      token,
      isModalOpen,
      enterpriseFeatures: {
        logoCobrand: {
          lightLogoSrc: 'https://issuerpoc.azurewebsites.net/gsklogotrans.png',
          darkLogoSrc: 'https://issuerpoc.azurewebsites.net/gsklogotrans.png',
        },
      },
      onComplete,
      onError: (error) => console.error('onError callback:', error),
      onUserExit: (userExitCode) =>
        console.log('onUserExit callback:', userExitCode),
      onModalRequestClose: () => setIsModalOpen(false),
      ...(sdkOptions || {}),
      customUI: {
        colorContentButtonPrimaryText: '#fff',
        colorBackgroundButtonPrimary: '#f36633',
        colorBorderButtonPrimary: '#f36633',
        colorBackgroundButtonPrimaryHover: '#F67E7D',
        colorBackgroundButtonPrimaryActive: '#843b62',
        colorBorderDocTypeButtonHover: '#F36633',
        colorBackgroundIcon: '#F36633',
        fontFamilyTitle: 'Arial',
        fontFamilySubtitle: 'Arial',
        fontFamilyBody: 'Arial',
        colorBorderLinkUnderline: '#D5D1CE',
        colorBackgroundLinkHover: '#544F40',
      },
      language: {
        phrases: {
          welcome: {
            title: 'Create your Verifiable Credential with Microsoft.',
            description_p_1:
              'To create your credentials, we will need to verify your identity. It will only take a few minutes.',
            description_p_2:
              'Please ready a government-issued identity document such as a Driver License, ID card, or passport.',
          },
          generic: {
            back: '',
          },
          cross_device_checklist: {
            button_primary: 'Generate Verifiable Credential',
          },
          outro: {
            title: 'Please Scan QR Code',
            body:
              'This will add your identity to the verifiable credential wallet.',
          },
        },
      },
    }
  } catch (err) {
    console.log('Failed to load SDK with logoCobranding option', err)

    options = {
      ...getInitSdkOptions(),
      token,
      isModalOpen,
      onComplete,
      onError: (error) => console.error('onError callback:', error),
      onUserExit: (userExitCode) =>
        console.log('onUserExit callback:', userExitCode),
      onModalRequestClose: () => setIsModalOpen(false),
      ...(sdkOptions || {}),
      customUI: {
        colorContentButtonPrimaryText: '#fff',
        colorBackgroundButtonPrimary: '#f36633',
        colorBorderButtonPrimary: '#f36633',
        colorBackgroundButtonPrimaryHover: '#F67E7D',
        colorBackgroundButtonPrimaryActive: '#843b62',
        colorBorderDocTypeButtonHover: '#F36633',
        colorBackgroundIcon: '#F36633',
        fontFamilyTitle: 'Arial',
        fontFamilySubtitle: 'Arial',
        fontFamilyBody: 'Arial',
        colorBorderLinkUnderline: '#D5D1CE',
        colorBackgroundLinkHover: '#544F40',
      },
      language: {
        phrases: {
          welcome: {
            title: 'Create your Verifiable Credential with Microsoft.',
            description_p_1:
              'To create your credentials, we will need to verify your identity. It will only take a few minutes.',
            description_p_2:
              'Please ready a government-issued identity document such as a Driver License, ID card, or passport.',
          },
          generic: {
            back: '',
          },
          cross_device_checklist: {
            button_primary: 'Generate Verifiable Credential',
          },
          outro: {
            title:
              'use the Microsoft Authenticator app to scan the QR code below',
            body: 'This will add your identity to the verifiable credential wallet.',
          },
        },
      },
    }
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
