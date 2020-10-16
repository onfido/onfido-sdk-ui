import { h } from 'preact'
import { mount } from 'enzyme'
import { expect } from 'chai'

describe('Mount Demo App', () => {
  let Demo = null

  beforeEach(() => (Demo = require('./demo.js')))

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
    beforeEach(() => {
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
    })

    it('mounts the Onfido Demo without crashing', () => {
      // the component needs to be assigned to a lowercase variable to work!
      const sdk = <Demo />
      const sdkDemo = mount(<sdk />)
      expect(sdkDemo.exists()).to.equal(true)
    })
  })
})
