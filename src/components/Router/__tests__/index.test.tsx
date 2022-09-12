import { h } from 'preact'
import { mount, shallow } from 'enzyme'
import '@testing-library/jest-dom'
import { SdkOptionsProvider } from '~contexts/useSdkOptions'
import MockedLocalised from '~jest/MockedLocalised'
import MockedReduxProvider, {
  mockedReduxProps,
} from '~jest/MockedReduxProvider'
import type { NarrowSdkOptions } from '~types/commons'
import Router from '../index'

jest.mock('~utils')
jest.mock('~utils/crossDeviceSync')
jest.mock('~utils/shouldUseCamera')

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
    const wrapper = shallow(<Router {...mockedReduxProps} />)
    expect(wrapper.exists()).toBeTruthy()
  })

  describe('when mounted', () => {
    it('renders MainRouter by default', () => {
      const wrapper = mount(
        <MockedReduxProvider>
          <SdkOptionsProvider options={defaultOptions}>
            <MockedLocalised>
              <Router {...mockedReduxProps} />
            </MockedLocalised>
          </SdkOptionsProvider>
        </MockedReduxProvider>
      )

      expect(wrapper.exists()).toBeTruthy()
      expect(wrapper.find('MainRouter').exists()).toBeTruthy()
      expect(wrapper.find('CrossDeviceMobileRouter').exists()).toBeFalsy()
    })

    it('renders CrossDeviceMobileRouter when mobileFlow=true', () => {
      const wrapper = mount(
        <MockedReduxProvider>
          <SdkOptionsProvider options={{ ...defaultOptions, mobileFlow: true }}>
            <MockedLocalised>
              <Router {...mockedReduxProps} />
            </MockedLocalised>
          </SdkOptionsProvider>
        </MockedReduxProvider>
      )

      expect(wrapper.exists()).toBeTruthy()
      expect(wrapper.find('MainRouter').exists()).toBeFalsy()
      expect(wrapper.find('CrossDeviceMobileRouter').exists()).toBeTruthy()
    })
  })
})
