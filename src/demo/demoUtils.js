export const queryParamToValueString = window.location.search
  .slice(1)
  .split('&')
  .reduce((/*Object*/ a, /*String*/ b) => {
    b = b.split('=')
    a[b[0]] = decodeURIComponent(b[1])
    return a
  }, {})

const getPreselectedDocumentTypes = () => {
  const preselectedDocumentType = queryParamToValueString.oneDoc
  if (preselectedDocumentType) {
    return {
      [preselectedDocumentType]: true,
    }
  } else if (queryParamToValueString.oneDocWithCountrySelection === 'true') {
    return {
      driving_licence: true,
    }
  } else if (queryParamToValueString.oneDocWithPresetCountry === 'true') {
    return {
      driving_licence: {
        country: 'ESP',
      },
    }
  } else if (queryParamToValueString.multiDocWithPresetCountry === 'true') {
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
  } else if (
    queryParamToValueString.multiDocWithInvalidPresetCountry === 'true'
  ) {
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

export const getTokenFactoryUrl = (region) => {
  switch (region) {
    case 'US':
      return process.env.US_JWT_FACTORY
    case 'CA':
      return process.env.CA_JWT_FACTORY
    default:
      return process.env.JWT_FACTORY
  }
}

export const getToken = (hasPreview, url, eventEmitter, onSuccess) => {
  const request = new XMLHttpRequest()
  request.open('GET', url, true)
  request.setRequestHeader(
    'Authorization',
    `BASIC ${process.env.SDK_TOKEN_FACTORY_SECRET}`
  )
  request.onload = function () {
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
      onSuccess(data.message)
    }
  }
  request.send()
}
