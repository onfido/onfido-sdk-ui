import { h } from 'preact'
import { mount, shallow } from 'enzyme'

import App from '../index'
import type { NormalisedSdkOptions } from '~types/commons'

jest.mock('Tracker/safeWoopra')

const defaultOptions: NormalisedSdkOptions = {
  steps: [
    { type: 'welcome' },
    { type: 'document' },
    { type: 'face' },
    { type: 'complete' },
  ],
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
