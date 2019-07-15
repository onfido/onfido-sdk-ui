export const queryStrings = window.location
                      .search.slice(1)
                      .split('&')
                      .reduce((/*Object*/ a, /*String*/ b) => {
                        b = b.split('=');
                        a[b[0]] = decodeURIComponent(b[1]);
                        return a;
                      }, {});

export const getInitSdkOptions = () => {

  if (queryStrings.link_id) return {
    mobileFlow: true,
    roomId: queryStrings.link_id.substring(2)
  }

  const language = queryStrings.language === 'customTranslations' ?
    {
      locale: 'fr',
      phrases: { 'welcome.title': 'Ouvrez votre nouveau compte bancaire' }
    } :
    queryStrings.language

  const steps = [
    'welcome',
    queryStrings.poa === 'true' && { type: 'poa' },
    {
      type:'document',
      options: {
        useWebcam: queryStrings.useWebcam === 'true',
        documentTypes: queryStrings.oneDoc === "true" ? { passport: true } : {}
      }
    },
    {
      type: 'face',
      options: {
        requestedVariant: queryStrings.liveness === 'true'
          ? 'video'
          : 'standard',
        useWebcam: queryStrings.useWebcam !== 'false',
        uploadFallback: queryStrings.uploadFallback !== 'false',
        useMultipleSelfieCapture: queryStrings.useMultipleSelfieCapture === 'true',
        snapshotInterval: queryStrings.snapshotInterval
          ? parseInt(queryStrings.snapshotInterval, 10)
          : 1000
      }
    },
    'complete'
  ].filter(Boolean)

  const smsNumberCountryCode = queryStrings.countryCode
    ? { smsNumberCountryCode: queryStrings.countryCode }
    : {}

  return {
    useModal: queryStrings.useModal === 'true',
    shouldCloseOnOverlayClick: queryStrings.shouldCloseOnOverlayClick !== 'false',
    language,
    steps,
    mobileFlow: false,
    userDetails: {
      smsNumber: queryStrings.smsNumber
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

export const commonPageSizes = {
  'Full Screen': {
    iframeWidth: '100%',
    iframeHeight: '100%'
  },
  'iPhone 6': {
    iframeWidth: '375px',
    iframeHeight: '667px'
  },
  'iPhone X': {
    iframeWidth: '375px',
    iframeHeight: '812px'
  }
}

export const commonContainerSizes = {
  'Full Screen': {
    containerWidth: '100%',
    containerHeight: '100%'
  },
  'Medium': {
    containerWidth: '80%',
    containerHeight: '80%'
  },
  'Tiny': {
    containerWidth: '40%',
    containerHeight: '40%'
  }
}
