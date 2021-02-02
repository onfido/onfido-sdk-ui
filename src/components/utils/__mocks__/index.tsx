export const checkIfWebcamPermissionGranted = jest
  .fn()
  .mockImplementation((callback) => callback(true))
