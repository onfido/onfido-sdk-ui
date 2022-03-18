export type SecureLinkViewType = {
  id: string
  className: string
  label: string
  subtitle: string
}[]

export const SECURE_LINK_VIEWS: SecureLinkViewType = [
  {
    id: 'qr_code',
    className: 'qrCodeLinkOption',
    label: 'get_link.link_qr',
    subtitle: 'get_link.subtitle_qr',
  },
  {
    id: 'sms',
    className: 'smsLinkOption',
    label: 'get_link.link_sms',
    subtitle: 'get_link.subtitle_sms',
  },
  {
    id: 'copy_link',
    className: 'copyLinkOption',
    label: 'get_link.link_url',
    subtitle: 'get_link.subtitle_url',
  },
]

export const configHasInvalidViewIds = (viewIdsInConfig: Array<string>) => {
  const validViewIds = new Set(SECURE_LINK_VIEWS.map(({ id }) => id))
  const invalidViewIds = viewIdsInConfig.filter(
    (viewId) => !validViewIds.has(viewId)
  )
  if (invalidViewIds.length > 0) {
    console.warn(
      'Default settings applied. Invalid properties in _crossDeviceLinkMethods option:',
      invalidViewIds.join(', ')
    )
    console.warn(
      '_crossDeviceLinkMethods must be an array with at least 1 of the following option: "qr_code", "copy_link", "sms"'
    )
    return true
  }
  return false
}

export const validatesViewIdWithFallback = (viewId: string) => {
  const validViewIds = SECURE_LINK_VIEWS.map(({ id }) => id)

  if (validViewIds.includes(viewId)) {
    return viewId
  }

  return 'qr_code'
}
