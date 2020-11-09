import { h } from 'preact'
import { mount } from 'enzyme'
import { expect } from 'chai'

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

    Demo = require('./demo.js')
  })

  describe('by mocking Onfido SDK', () => {
    // Mock window.Onfido
    global.Onfido = {
      init: () => {},
    }

    it('mounts the Onfido Demo without crashing', () => {
      // the component needs to be assigned to a lowercase variable to work!
      const sdk = <Demo />
      const sdkDemo = mount(<sdk />)
      expect(sdkDemo.exists()).to.equal(true)
    })
  })

  describe('without mocking Onfido SDK', () => {
    it('mounts the Onfido Demo without crashing', () => {
      // the component needs to be assigned to a lowercase variable to work!
      const sdk = <Demo />
      const sdkDemo = mount(<sdk />)
      expect(sdkDemo.exists()).to.equal(true)
    })
  })
})
