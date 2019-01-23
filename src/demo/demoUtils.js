import URLSearchParams from 'url-search-params'

export const getInitSdkOptions = () => {
  const searchParams = new URLSearchParams(window.location.search)
  if (searchParams.get('link_id')) return { mobileFlow: true }

  const language = searchParams.get('language') === 'customTranslations'
    ? {
      locale: 'fr',
      phrases: { 'welcome.title': 'Ouvrez votre nouveau compte bancaire' }
    }
    : searchParams.get('language')

  const steps = [
    'welcome',
    searchParams.get('poa') === 'true' && { type:'poa' },
    {
      type:'document',
      options: {
        useWebcam: searchParams.get('useWebcam') === 'true',
        documentTypes: {}
      }
    },
    {
      type: 'face',
      options: {
        requestedVariant: searchParams.get('liveness') === 'true'
          ? 'video'
          : 'standard',
        useWebcam: searchParams.get('useWebcam') !== 'false',
        uploadFallback: searchParams.get('uploadFallback') !== 'false',
        useMultipleSelfieCapture: searchParams.get('useMultipleSelfieCapture') === 'true',
        snapshotInterval: searchParams.get('snapshotInterval')
          ? parseInt(searchParams.get('snapshotInterval'), 10)
          : 1000
      }
    },
    'complete'
  ].filter(Boolean)

  const smsNumberCountryCode = searchParams.get('countryCode')
    ? { smsNumberCountryCode: searchParams.get('countryCode') }
    : {}

  return {
    useModal: searchParams.get('use_modal') === 'true',
    language,
    steps,
    mobileFlow: false,
    userDetails: {
      smsNumber: searchParams.get('smsNumber'),
    },
    ...smsNumberCountryCode,
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
    'face',
  ],

  'upload fallback': [
    'welcome',
    {
      type: 'document',
      options: {
        useWebcam: true,
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

  'no upload fallback': [
    'welcome',
    {
      type: 'document',
      options: {
        useWebcam: true,
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
