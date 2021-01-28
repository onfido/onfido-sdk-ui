export const createSocket = jest.fn().mockReturnValue({
  on: jest.fn(),
  off: jest.fn(),
  emit: jest.fn(),
  open: jest.fn(),
  close: jest.fn(),
})
