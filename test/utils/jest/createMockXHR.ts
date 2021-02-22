type MockedXhrParams = {
  status?: number
  response?: Record<string, unknown>
}

const createMockXHR = ({
  status = 201,
  response = {},
}: MockedXhrParams): XMLHttpRequest => {
  const xhr = new XMLHttpRequest()

  return {
    ...xhr,
    onload: jest.fn(),
    open: jest.fn(),
    send: jest.fn(),
    setRequestHeader: jest.fn(),
    status,
    response: JSON.stringify(response),
  }
}

export default createMockXHR
