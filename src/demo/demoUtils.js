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
