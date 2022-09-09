import type { LocaleConfig, SupportedLanguages } from '~types/locales'
import type {
  DocumentTypes,
  DocumentTypeConfig,
  PublicStepConfig,
  PublicStepTypes,
} from '~types/steps'
import type { ServerRegions, SdkOptions, SdkResponse } from '~types/sdk'
import type { UICustomizationOptions } from '~types/ui-customisation-options'
import type { EnterpriseCallbackResponse } from '~types/enterprise'

import type {
  ApplicantData,
  DecoupleResponseOptions,
  StringifiedBoolean,
} from './types'
import customUIConfig from './custom-ui-config.json'
import testDarkCobrandLogo from './assets/onfido-logo.svg'
import testLightCobrandLogo from './assets/onfido-logo-light.svg'
import sampleCompanyLogo from './assets/sample-logo.svg'
import testCases from './testCases'
import StepsRouter from 'components/Router/StepsRouter'

export type QueryParams = {
  countryCode?: StringifiedBoolean
  createCheck?: StringifiedBoolean
  disableAnalytics?: StringifiedBoolean
  disableAnalyticsCookies?: StringifiedBoolean
  forceCrossDevice?: StringifiedBoolean
  hideOnfidoLogo?: StringifiedBoolean
  language?: 'customTranslations' | SupportedLanguages
  customWelcomeScreenCopy?: StringifiedBoolean
  link_id?: string
  motionExperiment?: StringifiedBoolean
  docVideo?: StringifiedBoolean
  faceVideo?: StringifiedBoolean
  multiDocWithInvalidPresetCountry?: StringifiedBoolean
  multiDocWithPresetCountry?: StringifiedBoolean
  multiDocWithBooleanValues?: StringifiedBoolean
  noCompleteStep?: StringifiedBoolean
  noDocumentStep?: StringifiedBoolean
  oneDoc?: DocumentTypes
  oneDocWithCountrySelection?: StringifiedBoolean
  oneDocWithPresetCountry?: StringifiedBoolean
  poa?: StringifiedBoolean
  region?: string
  shouldCloseOnOverlayClick?: StringifiedBoolean
  showCobrand?: StringifiedBoolean
  showLogoCobrand?: StringifiedBoolean
  showAuth?: StringifiedBoolean
  smsNumber?: StringifiedBoolean
  snapshotInterval?: string
  uploadFallback?: StringifiedBoolean
  useHistory?: StringifiedBoolean
  useLiveDocumentCapture?: StringifiedBoolean
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
  token?: string
  applicantId?: StringifiedBoolean
  workflowRunId?: StringifiedBoolean
  testCase?: string
  apiToken?: string
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
      passport: false,
    }
  }

  return {}
}

const loadSdkOptions = () => {
  const persistedData = localStorage.getItem('onfido-sdk-options-demo')
  const sdkOptions: SdkOptions = persistedData ? JSON.parse(persistedData) : {}
  return sdkOptions
}

export const getInitSdkOptions = (): SdkOptions => {
  const sdkOptions: SdkOptions = loadSdkOptions()

  const linkId = queryParamToValueString.link_id as string

  if (linkId) {
    sdkOptions.mobileFlow = true
    sdkOptions.roomId = linkId.substring(2)
  }

  if (queryParamToValueString.language) {
    if (queryParamToValueString.language === 'customTranslations') {
      sdkOptions.language = SAMPLE_LOCALE
    } else {
      sdkOptions.language = queryParamToValueString.language
    }
  }

  if (!sdkOptions.steps) {
    const steps: Array<PublicStepConfig> = []

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

    if (queryParamToValueString.poa === 'true') {
      steps.push({ type: 'poa' })
    }

    if (queryParamToValueString.noDocumentStep !== 'true') {
      steps.push({
        type: 'document',
        options: {
          useLiveDocumentCapture:
            queryParamToValueString.useLiveDocumentCapture === 'true',
          uploadFallback: queryParamToValueString.uploadFallback !== 'false',
          useWebcam: queryParamToValueString.useWebcam === 'true',
          documentTypes: getPreselectedDocumentTypes(),
          forceCrossDevice: queryParamToValueString.forceCrossDevice === 'true',
          requestedVariant:
            queryParamToValueString.docVideo === 'true' ? 'video' : 'standard',
        },
      })
    }

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

    sdkOptions.steps = steps
  }

  if (queryParamToValueString.motionExperiment === 'true') {
    sdkOptions.overrideSdkConfiguration = {
      ...sdkOptions.overrideSdkConfiguration,
      experimental_features: {
        ...sdkOptions.overrideSdkConfiguration?.experimental_features,
        motion_experiment: {
          enabled: true,
        },
      },
    }
  }

  if (queryParamToValueString.countryCode) {
    sdkOptions.smsNumberCountryCode = queryParamToValueString.countryCode
  }

  if (!sdkOptions.enterpriseFeatures) {
    sdkOptions.enterpriseFeatures = {}
  }

  if (queryParamToValueString.hideOnfidoLogo === 'true') {
    sdkOptions.enterpriseFeatures.hideOnfidoLogo = true
  }
  if (queryParamToValueString.showCobrand === 'true') {
    sdkOptions.enterpriseFeatures.cobrand = { text: '[COMPANY/PRODUCT NAME]' }
  }
  if (queryParamToValueString.showLogoCobrand === 'true') {
    sdkOptions.enterpriseFeatures.logoCobrand = {
      lightLogoSrc: testLightCobrandLogo,
      darkLogoSrc: testDarkCobrandLogo,
    }
  }
  if (queryParamToValueString.useCustomizedApiRequests === 'true') {
    sdkOptions.enterpriseFeatures.useCustomizedApiRequests = true
  }
  if (queryParamToValueString.decoupleResponse === 'success') {
    const successResponse = Promise.resolve({
      onfidoSuccessResponse: {
        id: '123-456-789',
      },
    } as EnterpriseCallbackResponse)
    sdkOptions.enterpriseFeatures = {
      ...sdkOptions.enterpriseFeatures,
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
    sdkOptions.enterpriseFeatures = {
      ...sdkOptions.enterpriseFeatures,
      onSubmitDocument: () => Promise.reject(errorResponse),
      onSubmitSelfie: () => Promise.reject(errorResponse),
      onSubmitVideo: () => Promise.reject(errorResponse),
    }
  } else if (queryParamToValueString.decoupleResponse === 'onfido') {
    const response = Promise.resolve({ continueWithOnfidoSubmission: true })
    sdkOptions.enterpriseFeatures = {
      ...sdkOptions.enterpriseFeatures,
      onSubmitDocument: () => response,
      onSubmitSelfie: () => response,
      onSubmitVideo: () => response,
    }
  }

  if (queryParamToValueString.excludeSmsCrossDeviceOption === 'true') {
    sdkOptions._crossDeviceLinkMethods = ['copy_link', 'qr_code']
  }
  if (queryParamToValueString.singleCrossDeviceOption === 'true') {
    sdkOptions._crossDeviceLinkMethods = ['sms']
  }
  if (queryParamToValueString.invalidCrossDeviceAlternativeMethods === 'true') {
    sdkOptions._crossDeviceLinkMethods = ['copy', 'qrCode', 'sms']
  }

  if (queryParamToValueString.customisedUI === 'true') {
    sdkOptions.customUI = customUIConfig as UICustomizationOptions
  }

  if (
    queryParamToValueString.crossDeviceClientIntroCustomProductName === 'true'
  ) {
    sdkOptions.crossDeviceClientIntroProductName =
      'for a [COMPANY/PRODUCT NAME] loan'
  }
  if (
    queryParamToValueString.crossDeviceClientIntroCustomProductLogo === 'true'
  ) {
    sdkOptions.crossDeviceClientIntroProductLogoSrc = sampleCompanyLogo
  }
  if (queryParamToValueString.autoFocusOnInitialScreenTitle !== 'false') {
    sdkOptions.autoFocusOnInitialScreenTitle = true
  }

  if (queryParamToValueString.useModal === 'true') {
    sdkOptions.useModal = true
  }
  if (queryParamToValueString.shouldCloseOnOverlayClick !== 'false') {
    sdkOptions.shouldCloseOnOverlayClick = true
  }
  if (queryParamToValueString.disableAnalytics === 'true') {
    sdkOptions.disableAnalytics = true
  }
  if (queryParamToValueString.disableAnalyticsCookies === 'true') {
    sdkOptions.disableAnalyticsCookies = true
  }
  if (queryParamToValueString.useMemoryHistory === 'true') {
    sdkOptions.useMemoryHistory = true
  }

  if (!sdkOptions.userDetails) {
    sdkOptions.userDetails = {}
  }
  if (queryParamToValueString.smsNumber) {
    sdkOptions.userDetails.smsNumber = queryParamToValueString.smsNumber
  }

  let testCaseOptions: SdkOptions = {}
  if (queryParamToValueString.testCase) {
    const testCase = testCases[queryParamToValueString.testCase]
    if (!testCase) {
      console.warn(
        'The test case from the query param could not be found. The available keys are: ',
        Object.keys(testCases)
      )
    }

    testCaseOptions = testCase
  }

  return {
    ...sdkOptions,
    ...testCaseOptions,
  }
}

export const commonSteps: Record<
  string,
  Array<PublicStepTypes | PublicStepConfig>
> = {
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
  onSuccess: (token: string, applicantId: string) => void,
  apiToken?: string
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

  if (apiToken) {
    request.setRequestHeader('x-onfido-api-token', apiToken)
  }

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
