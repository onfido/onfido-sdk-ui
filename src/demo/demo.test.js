import { h } from 'preact'
import { mount } from 'enzyme'
import { expect } from 'chai'

describe('Mount Demo App by mocking Onfido SDK', () => {
  let Demo = null

  beforeEach(() => (Demo = require('./demo.js')))

  jest.mock('../index.js', () => ({
    // eslint-disable-next-line react/display-name
    init: () => <div />,
  }))

  it('renders the Onfido Demo without crashing', () => {
    // the component needs to be assigned to a lowercase variable to work!
    const sdk = <Demo />
    const sdkDemo = mount(<sdk />)
    expect(sdkDemo).to.be.ok
  })
})

describe('Mount Demo App without mocking Onfido SDK', () => {
  let Demo = null

  beforeEach(() => {
    Demo = require('./demo.js')
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
  it('renders the Onfido Demo without crashing', () => {
    // the component needs to be assigned to a lowercase variable to work!
    const sdk = <Demo />
    const sdkDemo = mount(<sdk />)
    expect(sdkDemo).to.be.ok
  })
})
