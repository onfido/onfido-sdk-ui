import { sendMultiframeSelfie } from "../onfidoApi.js"

let jwtToken = 'my_token'

const snapshot = {
  blob: new Blob,
  filename: 'applicant_selfie.jpg'
}

const selfie = {
  blob: new Blob,
  filename: 'applicant_selfie.jpg',
  sdkMetadata: {
    someStuff: "Hello"
  }
}

const url = "https://test.url.com"

const onSuccess = jest.fn((res) => console.log('called onSuccess', res))
const onError = jest.fn((res) => console.log('called onError', res))


const createMockXHR = () => {
  const mockXHR = {
    open: jest.fn(),
    onload: jest.fn(),
    onerror: jest.fn(),
    send: jest.fn(),
    setRequestHeader: jest.fn(),
    status: 201,
    response: JSON.stringify({"mock": "response"})
  }
  
  return mockXHR;
}

const oldXMLHttpRequest = window.XMLHttpRequest;
let mockXHR = null;

beforeEach(() => {
  mockXHR = createMockXHR();
  window.XMLHttpRequest = jest.fn(() => mockXHR);
});

afterEach(() => {
  window.XMLHttpRequest = oldXMLHttpRequest;
});

describe('sendMultiframeSelfie', () => {
  it('should send a selfie and a snapshot', () => {
    sendMultiframeSelfie(snapshot, selfie, jwtToken, url, onSuccess, onError)
    mockXHR.onload();
    // expect(onSuccess).toHaveBeenCalled()
    expect(mockXHR.send.mock.calls.length).toBe(1)
    mockXHR.onload();
    expect(mockXHR.send.mock.calls.length).toBe(1)
  })
})
