import type { LocaleConfig, SupportedLanguages } from '~types/locales'
import type {
  DocumentTypes,
  DocumentTypeConfig,
  StepConfig,
  StepTypes,
} from '~types/steps'
import type { ServerRegions, SdkOptions } from '~types/sdk'
import type {
  ApplicantData,
  DecoupleResponseOptions,
  StringifiedBoolean,
} from './types'

export type QueryParams = {
  countryCode?: StringifiedBoolean
  createCheck?: StringifiedBoolean
  disableAnalytics?: StringifiedBoolean
  forceCrossDevice?: StringifiedBoolean
  hideOnfidoLogo?: StringifiedBoolean
  language?: 'customTranslations' | SupportedLanguages
  link_id?: string
  docVideo?: StringifiedBoolean
  faceVideo?: StringifiedBoolean
  multiDocWithInvalidPresetCountry?: StringifiedBoolean
  multiDocWithPresetCountry?: StringifiedBoolean
  noCompleteStep?: StringifiedBoolean
  oneDoc?: DocumentTypes
  oneDocWithCountrySelection?: StringifiedBoolean
  oneDocWithPresetCountry?: StringifiedBoolean
  poa?: StringifiedBoolean
  region?: string
  shouldCloseOnOverlayClick?: StringifiedBoolean
  showCobrand?: StringifiedBoolean
  showUserConsent?: StringifiedBoolean
  smsNumber?: StringifiedBoolean
  snapshotInterva?: StringifiedBoolean
  snapshotInterval?: StringifiedBoolean
  uploadFallback?: StringifiedBoolean
  useHistory?: StringifiedBoolean
  useLiveDocumentCapture?: StringifiedBoolean
  useMemoryHistory?: StringifiedBoolean
  useModal?: StringifiedBoolean
  useMultipleSelfieCapture?: StringifiedBoolean
  useUploader?: StringifiedBoolean
  useWebcam?: StringifiedBoolean
  useCustomizedApiRequests?: StringifiedBoolean
  decoupleResponse?: DecoupleResponseOptions
}

export type CheckData = {
  applicantId: string | null
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

  const steps: Array<StepTypes | StepConfig> = [
    'welcome' as StepTypes,
    queryParamToValueString.showUserConsent === 'true' &&
      ({ type: 'userConsent' } as StepConfig),
    queryParamToValueString.poa === 'true' && ({ type: 'poa' } as StepConfig),
    {
      type: 'document',
      options: {
        useLiveDocumentCapture:
          queryParamToValueString.useLiveDocumentCapture === 'true',
        uploadFallback: queryParamToValueString.uploadFallback !== 'false',
        useWebcam: queryParamToValueString.useWebcam === 'true',
        documentTypes: getPreselectedDocumentTypes(),
        showCountrySelection:
          queryParamToValueString.oneDocWithCountrySelection === 'true',
        forceCrossDevice: queryParamToValueString.forceCrossDevice === 'true',
        requestedVariant:
          queryParamToValueString.docVideo === 'true' ? 'video' : 'standard',
      },
    } as StepConfig,
    {
      type: 'face',
      options: {
        useUploader: queryParamToValueString.useUploader === 'true',
        uploadFallback: queryParamToValueString.uploadFallback !== 'false',
        useMultipleSelfieCapture:
          queryParamToValueString.useMultipleSelfieCapture !== 'false',
        snapshotInterval: queryParamToValueString.snapshotInterval
          ? parseInt(queryParamToValueString.snapshotInterval, 10)
          : 500,
        requestedVariant:
          queryParamToValueString.faceVideo === 'true' ? 'video' : 'standard',
      },
    } as StepConfig,
    queryParamToValueString.noCompleteStep !== 'true' &&
      ({ type: 'complete' } as StepConfig),
  ].filter(Boolean)

  const smsNumberCountryCode = queryParamToValueString.countryCode
    ? { smsNumberCountryCode: queryParamToValueString.countryCode }
    : {}

  const hideOnfidoLogo = queryParamToValueString.hideOnfidoLogo === 'true'
  const cobrand =
    queryParamToValueString.showCobrand === 'true'
      ? { text: 'Planet Express, Incorporated' }
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
      useCustomizedApiRequests,
      ...decoupleCallbacks,
    },
    ...smsNumberCountryCode,
  }
}

export const commonSteps: Record<string, Array<StepTypes | StepConfig>> = {
  standard: null,

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

export const commonLanguages: Record<
  string,
  SupportedLanguages | LocaleConfig
> = {
  en: 'en',
  es: 'es',
  de: 'de',
  fr: 'fr',
  custom: {
    phrases: { 'welcome.title': 'My custom title' },
    mobilePhrases: {
      'capture.driving_licence.back.instructions': 'Custom instructions',
    },
  },
}

export const commonRegions: ServerRegions[] = ['EU', 'US', 'CA']

export const getTokenFactoryUrl = (region: ServerRegions): string => {
  switch (region) {
    case 'US':
      return process.env.US_JWT_FACTORY
    case 'CA':
      return process.env.CA_JWT_FACTORY
    default:
      return process.env.JWT_FACTORY
  }
}

const buildTokenRequestParams = (
  applicantData: ApplicantData | null
): string => {
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
  applicantData: ApplicantData | null,
  eventEmitter: MessagePort,
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
  tokenUrl: string,
  applicantId: string,
  applicantData: ApplicantData | null
): void => {
  const { poa, docVideo, faceVideo } = queryParamToValueString

  // Don't create check if createCheck flag isn't present
  if (!applicantData) {
    return
  }

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

  const body = {
    applicant_id: applicantId,
    report_names: [
      poa ? 'proof_of_address' : 'document',
      docVideo || faceVideo
        ? 'facial_similarity_video'
        : 'facial_similarity_photo',
    ],
  }

  request.send(JSON.stringify(body))
}
