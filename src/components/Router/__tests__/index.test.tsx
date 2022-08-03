import { h } from 'preact'
import { mount, shallow } from 'enzyme'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/preact'

import { SdkOptionsProvider } from '~contexts/useSdkOptions'
import MockedLocalised from '~jest/MockedLocalised'
import MockedReduxProvider, {
  mockedReduxProps,
} from '~jest/MockedReduxProvider'
import createMockStepsHook from '~jest/createMockStepsHook'
import type { NarrowSdkOptions } from '~types/commons'

import Router from '../index'
import { HistoryRouterWrapper } from '../HistoryRouter'

jest.mock('~utils')
jest.mock('~utils/crossDeviceSync')

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

    it('renders with edgeToEdgeContent=true on specific components', async () => {
      render(
        <MockedReduxProvider>
          <SdkOptionsProvider options={defaultOptions}>
            <MockedLocalised>
              <HistoryRouterWrapper
                options={defaultOptions}
                allowCrossDeviceFlow={false}
                useSteps={createMockStepsHook({
                  steps: [{ type: 'activeVideo' }],
                })}
                {...mockedReduxProps}
              />
            </MockedLocalised>
          </SdkOptionsProvider>
        </MockedReduxProvider>
      )

      let back = screen.getByText(/generic.back/)
      let navigationBar = back.closest('.navigationBar')
      expect(navigationBar?.classList.contains('transparent')).toBeFalsy()

      await userEvent.click(screen.getByText(/avc_intro.button_primary_ready/))

      back = screen.getByText(/generic.back/)
      navigationBar = back.closest('.navigationBar')
      expect(navigationBar?.classList.contains('transparent')).toBeTruthy()
    })
  })
})
