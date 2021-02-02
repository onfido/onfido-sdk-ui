export const buildIteratorKey = jest.fn().mockImplementation((key) => key)
export const checkIfHasWebcam = jest
  .fn()
  .mockImplementation((callback) => callback(true))
export const checkIfWebcamPermissionGranted = jest
  .fn()
  .mockImplementation((callback) => callback(true))
export const getEnabledDocuments = jest.fn().mockReturnValue([])
export const hasOnePreselectedDocument = jest.fn().mockReturnValue(false)
export const isSafari131 = jest.fn().mockReturnValue(false)
