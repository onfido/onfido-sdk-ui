export const buildIteratorKey = jest.fn().mockImplementation((key) => key)
export const checkIfHasWebcam = jest
  .fn()
  .mockImplementation((callback) => callback(true))
export const checkIfWebcamPermissionGranted = jest
  .fn()
  .mockImplementation((callback) => callback(true))
export const isSafari131 = jest.fn().mockReturnValue(false)
export const parseTags = jest
  .fn()
  .mockImplementation((text, handler) => handler({ text }))
export const wrapWithClass = jest
  .fn()
  .mockImplementation(({ children }) => children)
export const getCSSMillisecsValue = jest.fn().mockReturnValue('200ms')
