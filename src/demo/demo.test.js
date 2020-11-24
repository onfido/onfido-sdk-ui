import { h } from 'preact'
import { mount } from 'enzyme'

jest.mock('./demoUtils', () => ({
  getInitSdkOptions: jest.fn().mockReturnValue({}),
  queryParamToValueString: { useHistory: false },
  getTokenFactoryUrl: () => 'https://token-factory.onfido.com/sdk_token',
  getToken: jest
    .fn()
    .mockImplementation((_hasPreview, _url, _eventEmitter, onSuccess) =>
      onSuccess('TEST_TOKEN')
    ),
}))

// when the Onfido SDK is imported Woopra needs to be mocked
const mockWoopraFn = jest.fn()

jest.mock('../Tracker/safeWoopra', () =>
  jest.fn().mockImplementation(() => ({
    init: () => mockWoopraFn,
    config: () => mockWoopraFn,
    identify: () => mockWoopraFn,
    track: () => mockWoopraFn,
  }))
)

describe('Mount Demo App', () => {
  let Demo = null

  beforeEach(() => {
    // create rootNode
    const rootNode = document.createElement('div')
    rootNode.setAttribute('id', 'demo-app')
    window.domNode = rootNode
    document.body.appendChild(rootNode)
  })

  describe('by mocking Onfido SDK', () => {
    beforeEach(() => {
      // Mock window.Onfido
      window.Onfido = {
        init: jest.fn(),
      }

      Demo = require('./Demo').Demo
    })

    it('mounts the Onfido Demo without crashing', () => {
      const sdkDemo = mount(<Demo />)
      expect(sdkDemo.exists()).toBeTruthy()
      expect(window.Onfido.init).toHaveBeenCalled()
    })
  })

  describe('without mocking Onfido SDK', () => {
    beforeEach(() => {
      Demo = require('./Demo').Demo
    })

    it('mounts the Onfido Demo without crashing', () => {
      const sdkDemo = mount(<Demo />)
      expect(sdkDemo.exists()).toBeTruthy()
    })
  })
})
