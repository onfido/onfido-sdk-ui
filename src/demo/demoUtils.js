export const queryParamToValueString = window.location
                      .search.slice(1)
                      .split('&')
                      .reduce((/*Object*/ a, /*String*/ b) => {
                        b = b.split('=');
                        a[b[0]] = decodeURIComponent(b[1]);
                        return a;
                      }, {});

export const getInitSdkOptions = () => {

  if (queryParamToValueString.link_id) return {
    mobileFlow: true,
    roomId: queryParamToValueString.link_id.substring(2)
  }

  const language = queryParamToValueString.language === 'customTranslations' ?
    {
      locale: 'fr',
      phrases: { 'welcome.title': 'Ouvrez votre nouveau compte bancaire' }
    } :
    queryParamToValueString.language

  // FIXME: remove UI tests dependency on useWebcam at line 43
  //        (useWebcam is meant to only be used to enable document autocapture feature that is still in beta)
  const steps = [
    'welcome',
    queryParamToValueString.poa === 'true' && { type: 'poa' },
    {
      type:'document',
      options: {
        useLiveDocumentCapture: queryParamToValueString.useLiveDocumentCapture === 'true',
        uploadFallback: queryParamToValueString.uploadFallback !== 'false',
        useWebcam: queryParamToValueString.useWebcam === 'true',
        documentTypes: queryParamToValueString.oneDoc === "true" ? { passport: true } : {},
        forceCrossDevice: queryParamToValueString.forceCrossDevice === "true"
      }
    },
    {
      type: 'face',
      options: {
        requestedVariant: queryParamToValueString.liveness === 'true'
          ? 'video'
          : 'standard',
        useUploader: queryParamToValueString.useUploader === 'true',
        uploadFallback: queryParamToValueString.uploadFallback !== 'false',
        useMultipleSelfieCapture: queryParamToValueString.useMultipleSelfieCapture === 'true',
        snapshotInterval: queryParamToValueString.snapshotInterval
          ? parseInt(queryParamToValueString.snapshotInterval, 10)
          : 1000
      }
    },
    queryParamToValueString.noCompleteStep !== 'true' && 'complete'
  ].filter(Boolean)

  const smsNumberCountryCode = queryParamToValueString.countryCode
    ? { smsNumberCountryCode: queryParamToValueString.countryCode }
    : {}

  return {
    useModal: queryParamToValueString.useModal === 'true',
    shouldCloseOnOverlayClick: queryParamToValueString.shouldCloseOnOverlayClick !== 'true',
    language,
    steps,
    mobileFlow: false,
    userDetails: {
      smsNumber: queryParamToValueString.smsNumber
    },
    ...smsNumberCountryCode
  }
}

export const commonSteps = {
  'standard': null,

  'liveness': [
    'welcome',
    'document',
    {
      type: 'face',
      options: { requestedVariant: 'video' }
    },
    'complete'
  ],

  'poa': [
    'welcome',
    'poa',
    'complete'
  ],

  'no welcome': [
    'document',
    'face',
    'complete'
  ],

  'no complete': [
    'welcome',
    'document',
    'face'
  ],

  'upload fallback': [
    'welcome',
    {
      type: 'document',
      options: {
        useWebcam: false,
      }
    },
    {
      type: 'face',
      options: {
        uploadFallback: true
      }
    },
    'complete'
  ],
  'document autocapture (BETA)': [
    'welcome',
    {
      type: 'document',
      options: {
        useWebcam: true,
      }
    },
    'face',
    'complete'
  ],
  'document live capture (BETA)': [
    'welcome',
    {
      type: 'document',
      options: {
        useLiveDocumentCapture: true
      }
    },
    'face',
    'complete'
  ],
  'force cross device (docs)': [
    'welcome',
    {
      type: 'document',
      options: {
        forceCrossDevice: true,
      }
    },
    'face',
    'complete'
  ],
  'no upload fallback': [
    'welcome',
    {
      type: 'document',
      options: {
        useWebcam: false,
      }
    },
    {
      type: 'face',
      options: {
        uploadFallback: false
      }
    },
    'complete'
  ],
  'multiple selfie': [
    'welcome',
    'document',
    {
      type: 'face',
      options: {
        useMultipleSelfieCapture: true
      }
    },
    'complete'
  ]
}

export const commonLanguages = {
  en: 'en',
  es: 'es',
  'custom (fr)': {
    locale: 'fr',
    phrases: { 'welcome.title': 'Ouvrez votre nouveau compte bancaire' }
  }
}
