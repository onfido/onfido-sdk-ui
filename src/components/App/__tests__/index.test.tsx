import { h } from 'preact'
import { mount, shallow } from 'enzyme'

import App from '../index'
import type { SDKOptionsWithRenderData } from '~types/commons'

jest.mock('~core/Woopra/safeWoopra')
jest.mock('~utils')

const defaultOptions: SDKOptionsWithRenderData = {
  steps: [
    { type: 'welcome' },
    { type: 'document' },
    { type: 'face' },
    { type: 'data' },
    { type: 'complete' },
    { type: 'retry' },
  ],
  containerId: 'onfido-mount',
  containerEl: document.createElement('div'),
}

describe('App', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<App options={defaultOptions} />)
    expect(wrapper.exists()).toBeTruthy()
  })

  describe('when mounted', () => {
    it('renders without crashing', () => {
      const wrapper = mount(<App options={defaultOptions} />)
      expect(wrapper.exists()).toBeTruthy()
      expect(wrapper.find('ModalApp').exists()).toBeTruthy()
    })
  })
})
