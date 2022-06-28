export const appendToTracking = jest.fn()
export const trackComponent = jest.fn().mockImplementation((comp) => comp)
export const trackException = jest.fn()
export const sendEvent = jest.fn()
