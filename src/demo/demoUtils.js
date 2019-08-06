export const queryParamToValue = window.location
                      .search.slice(1)
                      .split('&')
                      .reduce((/*Object*/ a, /*String*/ b) => {
                        b = b.split('=');
                        a[b[0]] = decodeURIComponent(b[1]);
                        return a;
                      }, {});

export const getInitSdkOptions = () => {

  if (queryParamToValue.link_id) return {
    mobileFlow: true,
    roomId: queryParamToValue.link_id.substring(2)
  }

  const language = queryParamToValue.language === 'customTranslations' ?
    {
      locale: 'fr',
      phrases: { 'welcome.title': 'Ouvrez votre nouveau compte bancaire' }
    } :
    queryParamToValue.language

  // FIXME: remove code dependency on useWebcam at line 43 once PR #762 for UI tests refactor is merged into 'development' branch
  //        (useWebcam is meant to only be used to enable document autocapture feature that is still in beta)
  const steps = [
    'welcome',
    queryParamToValue.poa === 'true' && { type: 'poa' },
    {
      type:'document',
      options: {
        useWebcam: queryParamToValue.useWebcam === 'true',
        documentTypes: queryParamToValue.oneDoc === "true" ? { passport: true } : {},
        forceCrossDevice: queryParamToValue.forceCrossDevice === "true"
      }
    },
    {
      type: 'face',
      options: {
        requestedVariant: queryParamToValue.liveness === 'true'
          ? 'video'
          : 'standard',
        useWebcam: queryParamToValue.useWebcam !== 'false',
        uploadFallback: queryParamToValue.uploadFallback === 'true',
        useMultipleSelfieCapture: queryParamToValue.useMultipleSelfieCapture === 'true',
        snapshotInterval: queryParamToValue.snapshotInterval
          ? parseInt(queryParamToValue.snapshotInterval, 10)
          : 1000
      }
    },
    'complete'
  ].filter(Boolean)

  const smsNumberCountryCode = queryParamToValue.countryCode
    ? { smsNumberCountryCode: queryParamToValue.countryCode }
    : {}

  return {
    useModal: queryParamToValue.useModal === 'true',
    shouldCloseOnOverlayClick: queryParamToValue.shouldCloseOnOverlayClick !== 'true',
    language,
    steps,
    mobileFlow: false,
    userDetails: {
      smsNumber: queryParamToValue.smsNumber
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
        useWebcam: true,
        uploadFallback: true
      }
    },
    'complete'
  ],
  'document autocapture (beta)': [
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
        useWebcam: true,
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
        useWebcam: true,
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
