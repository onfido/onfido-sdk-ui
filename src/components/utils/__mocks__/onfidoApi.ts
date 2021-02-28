export const { objectToFormData, formatError } = jest.requireActual(
  '../onfidoApi'
)
export const uploadDocument = jest.fn().mockResolvedValue({})
export const uploadLiveVideo = jest.fn().mockResolvedValue({})
export const sendMultiframeSelfie = jest.fn().mockResolvedValue({})
export const uploadLivePhoto = jest.fn().mockResolvedValue({})
