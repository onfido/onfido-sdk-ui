type MockedXhrParams = {
  status: number
  response: Record<string, unknown>
}

const createMockXHR = (params: MockedXhrParams): XMLHttpRequest => {
  const xhr = new XMLHttpRequest()
  const { status = 201, response } = params

  return {
    ...xhr,
    open: jest.fn(),
    send: jest.fn(),
    setRequestHeader: jest.fn(),
    status,
    response: JSON.stringify(response),
  }
}

export default createMockXHR
