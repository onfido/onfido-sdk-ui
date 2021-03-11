import { h } from 'preact'
import { mount, shallow } from 'enzyme'

import MockedReduxProvider from '~jest/MockedReduxProvider'
import { LocaleProvider } from '~locales'
import ModalApp from '../ModalApp'

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

describe('ModalApp', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<ModalApp options={{}} />)
    expect(wrapper.exists()).toBeTruthy()
  })

  describe('when mounted', () => {
    it('renders without crashing', () => {
      const wrapper = mount(
        <MockedReduxProvider>
          <ModalApp options={defaultOptions} />
        </MockedReduxProvider>
      )

      expect(wrapper.exists()).toBeTruthy()
      expect(wrapper.find(LocaleProvider).exists()).toBeTruthy()
    })
  })
})
