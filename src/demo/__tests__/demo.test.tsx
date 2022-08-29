import { h, FunctionComponent } from 'preact'
import { mount } from 'enzyme'

declare global {
  interface Window {
    domNode: HTMLElement
  }
}

jest.mock('../demoUtils', () => ({
  getInitSdkOptions: jest.fn().mockReturnValue({}),
  queryParamToValueString: { useHistory: false },
  getTokenFactoryUrl: () => 'https://token-factory.onfido.com/sdk_token',
  getToken: jest
    .fn()
    .mockImplementation(
      (_hasPreview, _url, _applicantData, _eventEmitter, onSuccess) =>
        onSuccess('TEST_TOKEN')
    ),
}))

const mockedConsole = jest.fn()
console.log = mockedConsole

describe('Demo app', () => {
  let SdkDemo: FunctionComponent

  beforeEach(() => {
    // create rootNode
    const rootNode = document.createElement('div')
    rootNode.setAttribute('id', 'demo-app')
    window.domNode = rootNode
    document.body.appendChild(rootNode)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('by mocking Onfido SDK', () => {
    beforeEach(() => {
      window.Onfido = {
        init: jest.fn().mockImplementation(() => ({
          options: {},
          setOptions: jest.fn(),
          tearDown: jest.fn(),
        })),
      }

      SdkDemo = require('../demo').SdkDemo // eslint-disable-line @typescript-eslint/no-var-requires
    })

    it('mounts the Onfido SdkDemo without crashing', () => {
      const sdkDemo = mount(<SdkDemo />)
      expect(sdkDemo.exists()).toBeTruthy()
      expect(window.Onfido.init).toHaveBeenCalled()
      expect(mockedConsole).toHaveBeenCalledWith(
        '* JWT Factory URL:',
        'https://token-factory.onfido.com/sdk_token',
        'for',
        'EU',
        'in',
        process.env.NODE_ENV
      )
    })
  })

  describe('without mocking Onfido SDK', () => {
    beforeEach(() => {
      SdkDemo = require('../demo').SdkDemo // eslint-disable-line @typescript-eslint/no-var-requires
    })

    it('mounts the Onfido SdkDemo without crashing', () => {
      const sdkDemo = mount(<SdkDemo />)
      expect(sdkDemo.exists()).toBeTruthy()
      expect(mockedConsole).toHaveBeenCalledWith(
        '* JWT Factory URL:',
        'https://token-factory.onfido.com/sdk_token',
        'for',
        'EU',
        'in',
        process.env.NODE_ENV
      )
    })
  })
})
