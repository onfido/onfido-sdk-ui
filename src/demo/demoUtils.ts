import type { LocaleConfig, SupportedLanguages } from '~types/locales'
import type {
  DocumentTypes,
  DocumentTypeConfig,
  StepConfig,
  StepTypes,
} from '~types/steps'
import type { ServerRegions, SdkOptions, SdkResponse } from '~types/sdk'
import type { UICustomizationOptions } from '~types/ui-customisation-options'

import type {
  ApplicantData,
  DecoupleResponseOptions,
  StringifiedBoolean,
} from './types'
import customUIConfig from './custom-ui-config.json'
import testDarkCobrandLogo from './assets/onfido-logo.svg'
import testLightCobrandLogo from './assets/onfido-logo-light.svg'
import sampleCompanyLogo from './assets/sample-logo.svg'

export type QueryParams = {
  countryCode?: StringifiedBoolean
  createCheck?: StringifiedBoolean
  disableAnalytics?: StringifiedBoolean
  forceCrossDevice?: StringifiedBoolean
  hideOnfidoLogo?: StringifiedBoolean
  language?: 'customTranslations' | SupportedLanguages
  customWelcomeScreenCopy?: StringifiedBoolean
  link_id?: string
  docVideo?: StringifiedBoolean
  faceVideo?: StringifiedBoolean
  multiDocWithInvalidPresetCountry?: StringifiedBoolean
  multiDocWithPresetCountry?: StringifiedBoolean
  multiDocWithBooleanValues?: StringifiedBoolean
  noCompleteStep?: StringifiedBoolean
  oneDoc?: DocumentTypes
  oneDocWithCountrySelection?: StringifiedBoolean
  oneDocWithPresetCountry?: StringifiedBoolean
  poa?: StringifiedBoolean
  region?: string
  shouldCloseOnOverlayClick?: StringifiedBoolean
  showCobrand?: StringifiedBoolean
  showLogoCobrand?: StringifiedBoolean
  showUserConsent?: StringifiedBoolean
  showAuth?: StringifiedBoolean
  smsNumber?: StringifiedBoolean
  snapshotInterval?: string
  uploadFallback?: StringifiedBoolean
  useHistory?: StringifiedBoolean
  useLiveDocumentCapture?: StringifiedBoolean
  useMultiFrameCapture?: StringifiedBoolean
  useMemoryHistory?: StringifiedBoolean
  useModal?: StringifiedBoolean
  useMultipleSelfieCapture?: StringifiedBoolean
  useUploader?: StringifiedBoolean
  useWebcam?: StringifiedBoolean
  customisedUI?: StringifiedBoolean
  useCustomizedApiRequests?: StringifiedBoolean
  decoupleResponse?: DecoupleResponseOptions
  photoCaptureFallback?: StringifiedBoolean
  showUserAnalyticsEvents?: StringifiedBoolean
  excludeSmsCrossDeviceOption?: StringifiedBoolean
  singleCrossDeviceOption?: StringifiedBoolean
  invalidCrossDeviceAlternativeMethods?: StringifiedBoolean
  crossDeviceClientIntroCustomProductName?: StringifiedBoolean
  crossDeviceClientIntroCustomProductLogo?: StringifiedBoolean
  autoFocusOnInitialScreenTitle?: StringifiedBoolean
}

export type CheckData = {
  applicantId?: string
  sdkFlowCompleted: boolean
}

export type UIConfigs = {
  darkBackground: boolean
  iframeWidth: string
  iframeHeight: string
  tearDown: boolean
}

const SAMPLE_LOCALE: LocaleConfig = {
  locale: 'en',
  phrases: { 'welcome.title': 'My custom title' },
  mobilePhrases: {
    'capture.driving_licence.back.instructions': 'Custom instructions',
  },
}

export const queryParamToValueString = window.location.search
  .slice(1)
  .split('&')
  .reduce((acc: QueryParams, cur: string) => {
    const [key, value] = cur.split('=')
    return { ...acc, [key]: value }
  }, {})

const getPreselectedDocumentTypes = (): Partial<
  Record<DocumentTypes, DocumentTypeConfig>
> => {
  const preselectedDocumentType = queryParamToValueString.oneDoc

  if (preselectedDocumentType) {
    return {
      [preselectedDocumentType]: true,
    }
  }

  if (queryParamToValueString.oneDocWithCountrySelection === 'true') {
    return {
      driving_licence: true,
    }
  }

  if (queryParamToValueString.oneDocWithPresetCountry === 'true') {
    return {
      driving_licence: {
        country: 'ESP',
      },
    }
  }

  if (queryParamToValueString.multiDocWithPresetCountry === 'true') {
    return {
      driving_licence: {
        country: 'ESP',
      },
      national_identity_card: {
        country: 'MYS',
      },
      residence_permit: {
        country: null,
      },
    }
  }

  if (queryParamToValueString.multiDocWithInvalidPresetCountry === 'true') {
    return {
      driving_licence: {
        country: 'ES',
      },
      national_identity_card: {
        country: 'XYZ',
      },
    }
  }

  if (queryParamToValueString.multiDocWithBooleanValues === 'true') {
    return {
      driving_licence: true,
      national_identity_card: true,
    }
  }

  return {}
}

export const getInitSdkOptions = (): SdkOptions => {
  const linkId = queryParamToValueString.link_id as string

  if (linkId) {
    return {
      mobileFlow: true,
      roomId: linkId.substring(2),
    }
  }

  const language =
    queryParamToValueString.language === 'customTranslations'
      ? SAMPLE_LOCALE
      : queryParamToValueString.language

  const steps: Array<StepConfig> = []

  if (queryParamToValueString.customWelcomeScreenCopy === 'true') {
    steps.push({
      type: 'welcome',
      options: {
        title: 'Open your new bank account',
        descriptions: [
          'To open a bank account, we will need to verify your identity.',
          'It will only take a couple of minutes.',
        ],
        nextButton: 'Verify Identity',
      },
    })
  } else {
    steps.push({ type: 'welcome' })
  }

  if (queryParamToValueString.showAuth === 'true') {
    steps.push({ type: 'auth', options: { retries: 10 } })
  }

  if (queryParamToValueString.showUserConsent === 'true') {
    steps.push({ type: 'userConsent' })
  }

  if (queryParamToValueString.poa === 'true') {
    steps.push({ type: 'poa' })
  }

  steps.push({
    type: 'document',
    options: {
      useLiveDocumentCapture:
        queryParamToValueString.useLiveDocumentCapture === 'true',
      useMultiFrameCapture:
        queryParamToValueString.useMultiFrameCapture === 'true',
      uploadFallback: queryParamToValueString.uploadFallback !== 'false',
      useWebcam: queryParamToValueString.useWebcam === 'true',
      documentTypes: getPreselectedDocumentTypes(),
      showCountrySelection:
        queryParamToValueString.oneDocWithCountrySelection === 'true',
      forceCrossDevice: queryParamToValueString.forceCrossDevice === 'true',
      requestedVariant:
        queryParamToValueString.docVideo === 'true' ? 'video' : 'standard',
    },
  })

  steps.push({
    type: 'face',
    options: {
      useUploader: queryParamToValueString.useUploader === 'true',
      uploadFallback: queryParamToValueString.uploadFallback !== 'false',
      useMultipleSelfieCapture:
        queryParamToValueString.useMultipleSelfieCapture !== 'false',
      photoCaptureFallback:
        queryParamToValueString.photoCaptureFallback !== 'false',
      requestedVariant:
        queryParamToValueString.faceVideo === 'true' ? 'video' : 'standard',
    },
  })

  if (queryParamToValueString.noCompleteStep !== 'true') {
    steps.push({ type: 'complete' })
  }

  const smsNumberCountryCode = queryParamToValueString.countryCode
    ? { smsNumberCountryCode: queryParamToValueString.countryCode }
    : {}

  const hideOnfidoLogo = queryParamToValueString.hideOnfidoLogo === 'true'
  const cobrand =
    queryParamToValueString.showCobrand === 'true'
      ? { text: '[COMPANY/PRODUCT NAME]' }
      : undefined
  const logoCobrand =
    queryParamToValueString.showLogoCobrand === 'true'
      ? { lightLogoSrc: testLightCobrandLogo, darkLogoSrc: testDarkCobrandLogo }
      : undefined
  const useCustomizedApiRequests =
    queryParamToValueString.useCustomizedApiRequests === 'true'
  let decoupleCallbacks = {}
  if (queryParamToValueString.decoupleResponse === 'success') {
    const successResponse = Promise.resolve({
      onfidoSuccessResponse: {
        id: '123-456-789',
      },
    })
    decoupleCallbacks = {
      onSubmitDocument: () => successResponse,
      onSubmitSelfie: () => successResponse,
      onSubmitVideo: () => successResponse,
    }
  } else if (queryParamToValueString.decoupleResponse === 'error') {
    const errorResponse = {
      status: 422,
      response: JSON.stringify({
        error: {
          message: 'There was a validation error on this request',
          type: 'validation_error',
          fields: { detect_glare: ['glare found in image'] },
        },
      }),
    }
    decoupleCallbacks = {
      onSubmitDocument: () => Promise.reject(errorResponse),
      onSubmitSelfie: () => Promise.reject(errorResponse),
      onSubmitVideo: () => Promise.reject(errorResponse),
    }
  } else if (queryParamToValueString.decoupleResponse === 'onfido') {
    const response = Promise.resolve({ continueWithOnfidoSubmission: true })
    decoupleCallbacks = {
      onSubmitDocument: () => response,
      onSubmitSelfie: () => response,
      onSubmitVideo: () => response,
    }
  }

  let visibleCrossDeviceMethods
  if (queryParamToValueString.excludeSmsCrossDeviceOption === 'true') {
    visibleCrossDeviceMethods = ['copy_link', 'qr_code']
  }
  if (queryParamToValueString.singleCrossDeviceOption === 'true') {
    visibleCrossDeviceMethods = ['sms']
  }
  if (queryParamToValueString.invalidCrossDeviceAlternativeMethods === 'true') {
    visibleCrossDeviceMethods = ['copy', 'qrCode', 'sms']
  }

  const customUI =
    queryParamToValueString.customisedUI === 'true' ? customUIConfig : undefined

  const crossDeviceClientIntroProductName =
    queryParamToValueString.crossDeviceClientIntroCustomProductName === 'true'
      ? 'for a [COMPANY/PRODUCT NAME] loan'
      : undefined
  const crossDeviceClientIntroProductLogoSrc =
    queryParamToValueString.crossDeviceClientIntroCustomProductLogo === 'true'
      ? sampleCompanyLogo
      : undefined

  let autoFocusOnInitialScreenTitle = true
  if (queryParamToValueString.autoFocusOnInitialScreenTitle) {
    autoFocusOnInitialScreenTitle =
      queryParamToValueString.autoFocusOnInitialScreenTitle === 'true'
  }

  return {
    useModal: queryParamToValueString.useModal === 'true',
    shouldCloseOnOverlayClick:
      queryParamToValueString.shouldCloseOnOverlayClick !== 'true',
    language,
    disableAnalytics: queryParamToValueString.disableAnalytics === 'true',
    useMemoryHistory: queryParamToValueString.useMemoryHistory === 'true',
    steps,
    mobileFlow: false,
    userDetails: {
      smsNumber: queryParamToValueString.smsNumber,
    },
    enterpriseFeatures: {
      hideOnfidoLogo,
      cobrand,
      logoCobrand,
      useCustomizedApiRequests,
      ...decoupleCallbacks,
    },
    customUI: customUI as UICustomizationOptions,
    crossDeviceClientIntroProductName,
    crossDeviceClientIntroProductLogoSrc,
    ...smsNumberCountryCode,
    _crossDeviceLinkMethods: visibleCrossDeviceMethods,
    autoFocusOnInitialScreenTitle,
  }
}

export const commonSteps: Record<string, Array<StepTypes | StepConfig>> = {
  standard: [],

  faceVideo: [
    'welcome',
    'document',
    {
      type: 'face',
      options: { requestedVariant: 'video' },
    },
    'complete',
  ],

  poa: ['welcome', 'poa', 'complete'],

  'no welcome': ['document', 'face', 'complete'],

  'no complete': ['welcome', 'document', 'face'],

  'upload fallback': [
    'welcome',
    {
      type: 'document',
      options: {
        useWebcam: false,
      },
    },
    {
      type: 'face',
      options: {
        uploadFallback: true,
      },
    },
    'complete',
  ],
  'document autocapture (BETA)': [
    'welcome',
    {
      type: 'document',
      options: {
        useWebcam: true,
      },
    },
    'face',
    'complete',
  ],
  'document live capture (BETA)': [
    'welcome',
    {
      type: 'document',
      options: {
        useLiveDocumentCapture: true,
      },
    },
    'face',
    'complete',
  ],
  'Multi-frame capture (BETA)': [
    'welcome',
    {
      type: 'document',
      options: {
        useMultiFrameCapture: true,
      },
    },
    'face',
    'complete',
  ],
  'force cross device (docs)': [
    'welcome',
    {
      type: 'document',
      options: {
        forceCrossDevice: true,
      },
    },
    'face',
    'complete',
  ],
  'no upload fallback': [
    'welcome',
    {
      type: 'document',
      options: {
        useWebcam: false,
      },
    },
    {
      type: 'face',
      options: {
        uploadFallback: false,
      },
    },
    'complete',
  ],
  'no snapshot': [
    'welcome',
    'document',
    {
      type: 'face',
      options: {
        useMultipleSelfieCapture: false,
      },
    },
    'complete',
  ],
}

export const commonVisibleCrossDeviceLinkOptions: Record<string, string[]> = {
  smsOnly: ['sms'],
  copyLinkOnly: ['copy_link'],
  qrCodeOnly: ['qr_code'],
  excludeSms: ['copy_link', 'qr_code'],
  reorderOptions: ['sms', 'copy_link', 'qr_code'],
  invalidOptions: ['copy', 'qrCode', 'sms'],
}

export const commonLanguages: Record<
  string,
  SupportedLanguages | LocaleConfig
> = {
  en: 'en',
  es: 'es',
  de: 'de',
  fr: 'fr',
  nl: 'nl',
  custom: {
    phrases: { 'welcome.title': 'My custom title' },
    mobilePhrases: {
      'capture.driving_licence.back.instructions': 'Custom instructions',
    },
  },
}

export const commonRegions: ServerRegions[] = ['EU', 'US', 'CA']

export const getTokenFactoryUrl = (region: ServerRegions): string => {
  if (region === 'US' && process.env.US_JWT_FACTORY) {
    return process.env.US_JWT_FACTORY
  }

  if (region === 'CA' && process.env.CA_JWT_FACTORY) {
    return process.env.CA_JWT_FACTORY
  }

  if (region === 'EU' && process.env.JWT_FACTORY) {
    return process.env.JWT_FACTORY
  }

  throw new Error('No JWT_FACTORY env provided')
}

const buildTokenRequestParams = (applicantData?: ApplicantData): string => {
  if (!applicantData) {
    return ''
  }

  return Object.entries(applicantData)
    .filter(([, value]) => value)
    .map((pair) => pair.join('='))
    .join('&')
}

export const getToken = (
  hasPreview: boolean,
  url: string,
  applicantData: ApplicantData | undefined,
  eventEmitter: MessagePort | undefined,
  onSuccess: (token: string, applicantId: string) => void
): void => {
  const request = new XMLHttpRequest()

  request.open(
    'GET',
    [url, buildTokenRequestParams(applicantData)].join('?'),
    true
  )

  request.setRequestHeader(
    'Authorization',
    `BASIC ${process.env.SDK_TOKEN_FACTORY_SECRET}`
  )

  request.onload = () => {
    if (request.status >= 200 && request.status < 400) {
      const data = JSON.parse(request.responseText)
      if (hasPreview && eventEmitter) {
        eventEmitter.postMessage({
          type: 'UPDATE_CHECK_DATA',
          payload: {
            applicantId: data.applicant_id,
          },
        })
      }
      onSuccess(data.message, data.applicant_id)
    }
  }
  request.send()
}

export const createCheckIfNeeded = (
  tokenUrl?: string,
  applicantId?: string,
  submittedData?: SdkResponse
): void => {
  // Don't create check if createCheck flag isn't present
  if (!queryParamToValueString.createCheck || !tokenUrl || !applicantId) {
    return
  }

  const { poa, docVideo, faceVideo } = queryParamToValueString

  const request = new XMLHttpRequest()

  request.open('POST', tokenUrl.replace('sdk_token', 'check'), true)
  request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')

  request.setRequestHeader(
    'Authorization',
    `BASIC ${process.env.SDK_TOKEN_FACTORY_SECRET}`
  )

  request.onload = () => {
    if (request.status >= 200 && request.status < 400) {
      const data = JSON.parse(request.responseText)
      console.log('Check created!', data)
    }
  }

  const documentIds = docVideo
    ? submittedData?.document_video?.media_uuids
    : undefined

  const documentReport = docVideo ? 'document_video_capture' : 'document'

  const body = {
    applicant_id: applicantId,
    report_names: [
      poa ? 'proof_of_address' : documentReport,
      faceVideo ? 'facial_similarity_video' : 'facial_similarity_photo',
    ],
    document_ids: documentIds,
    // api_version: docVideo ? 'v4' : 'v3',
  }

  request.send(JSON.stringify(body))
}
