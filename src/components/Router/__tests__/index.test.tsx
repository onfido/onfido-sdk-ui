import { h } from 'preact'
import { mount, shallow } from 'enzyme'

import MockedLocalised from '~jest/MockedLocalised'
import MockedReduxProvider, {
  mockedReduxProps,
} from '~jest/MockedReduxProvider'
import Router from '../index'

import type { NarrowSdkOptions } from '~types/commons'

jest.mock('../../utils')
jest.mock('../../utils/crossDeviceSync')

const defaultOptions: NarrowSdkOptions = {
  steps: [
    { type: 'welcome' },
    { type: 'document' },
    { type: 'face' },
    { type: 'complete' },
  ],
}

describe('Router', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(
      <Router {...mockedReduxProps} options={defaultOptions} />
    )
    expect(wrapper.exists()).toBeTruthy()
  })

  describe('when mounted', () => {
    it('renders MainRouter by default', () => {
      const wrapper = mount(
        <MockedReduxProvider>
          <MockedLocalised>
            <Router {...mockedReduxProps} options={defaultOptions} />
          </MockedLocalised>
        </MockedReduxProvider>
      )

      expect(wrapper.exists()).toBeTruthy()
      expect(wrapper.find('MainRouter').exists()).toBeTruthy()
      expect(wrapper.find('CrossDeviceMobileRouter').exists()).toBeFalsy()
    })

    it('renders CrossDeviceMobileRouter when mobileFlow=true', () => {
      const wrapper = mount(
        <MockedReduxProvider>
          <MockedLocalised>
            <Router
              {...mockedReduxProps}
              options={{ ...defaultOptions, mobileFlow: true }}
            />
          </MockedLocalised>
        </MockedReduxProvider>
      )

      expect(wrapper.exists()).toBeTruthy()
      expect(wrapper.find('MainRouter').exists()).toBeFalsy()
      expect(wrapper.find('CrossDeviceMobileRouter').exists()).toBeTruthy()
    })
  })
})
