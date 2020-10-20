export const queryParamToValueString = window.location.search
  .slice(1)
  .split('&')
  .reduce((/*Object*/ a, /*String*/ b) => {
    b = b.split('=')
    a[b[0]] = decodeURIComponent(b[1])
    return a
  }, {})

const getPreselectedDocumentTypes = () => {
  if (queryParamToValueString.oneDoc) {
    return {
      passport: true,
    }
  } else if (
    queryParamToValueString.oneDocWithCountrySelection === 'true' ||
    queryParamToValueString.oneDocWithoutCountrySelection === 'true'
  ) {
    return {
      driving_licence: true,
    }
  }
  return {}
}

export const getInitSdkOptions = () => {
  if (queryParamToValueString.link_id)
    return {
      mobileFlow: true,
      roomId: queryParamToValueString.link_id.substring(2),
    }

  const language =
    queryParamToValueString.language === 'customTranslations'
      ? {
          phrases: { 'welcome.title': 'My custom title' },
          mobilePhrases: {
            'capture.driving_licence.back.instructions': 'Custom instructions',
          },
        }
      : queryParamToValueString.language

  const steps = [
    'welcome',
    queryParamToValueString.poa === 'true' && { type: 'poa' },
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
      },
    },
    {
      type: 'face',
      options: {
        requestedVariant:
          queryParamToValueString.liveness === 'true' ? 'video' : 'standard',
        useUploader: queryParamToValueString.useUploader === 'true',
        uploadFallback: queryParamToValueString.uploadFallback !== 'false',
        useMultipleSelfieCapture:
          queryParamToValueString.useMultipleSelfieCapture !== 'false',
        snapshotInterval: queryParamToValueString.snapshotInterval
          ? parseInt(queryParamToValueString.snapshotInterval, 10)
          : 1000,
      },
    },
    queryParamToValueString.noCompleteStep !== 'true' && 'complete',
  ].filter(Boolean)

  const smsNumberCountryCode = queryParamToValueString.countryCode
    ? { smsNumberCountryCode: queryParamToValueString.countryCode }
    : {}

  const hideOnfidoLogo = queryParamToValueString.hideOnfidoLogo === 'true'
  const cobrand =
    queryParamToValueString.showCobrand === 'true'
      ? { text: 'Planet Express, Incorporated' }
      : null

  return {
    useModal: queryParamToValueString.useModal === 'true',
    shouldCloseOnOverlayClick:
      queryParamToValueString.shouldCloseOnOverlayClick !== 'true',
    language,
    disableAnalytics: true,
    useMemoryHistory: queryParamToValueString.useMemoryHistory === 'true',
    steps,
    mobileFlow: false,
    userDetails: {
      smsNumber: queryParamToValueString.smsNumber,
    },
    enterpriseFeatures: {
      hideOnfidoLogo,
      cobrand,
    },
    ...smsNumberCountryCode,
  }
}

export const commonSteps = {
  standard: null,

  liveness: [
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

export const commonLanguages = {
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

export const commonRegions = ['EU', 'US', 'CA']
