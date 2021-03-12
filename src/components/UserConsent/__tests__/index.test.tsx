import { h } from 'preact'
import { mount, shallow } from 'enzyme'
import { sanitize } from 'dompurify'

import { SdkOptionsProvider } from '~contexts/useSdkOptions'
import MockedLocalised from '~jest/MockedLocalised'
import { mockedReduxProps } from '~jest/MockedReduxProvider'
import UserConsent from '../index'

import type { StepComponentBaseProps } from '~types/routers'
import type { NarrowSdkOptions } from '~types/commons'

jest.mock('dompurify')

const defaultOptions: NarrowSdkOptions = {
  steps: [{ type: 'welcome' }, { type: 'userConsent' }],
}

const defaultProps: StepComponentBaseProps = {
  ...mockedReduxProps,
  componentsList: [
    { component: UserConsent, step: { type: 'userConsent' }, stepIndex: 0 },
  ],
  allowCrossDeviceFlow: true,
  back: jest.fn(),
  changeFlowTo: jest.fn(),
  nextStep: jest.fn(),
  previousStep: jest.fn(),
  triggerOnError: jest.fn(),
  resetSdkFocus: jest.fn(),
  trackScreen: jest.fn(),
}

console.error = jest.fn()

describe('UserConsent', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<UserConsent {...defaultProps} />)
    expect(wrapper.exists()).toBeTruthy()
  })

  describe('when mounted', () => {
    beforeEach(() => {
      const sanitizer = sanitize as jest.Mock
      sanitizer.mockReturnValueOnce('<h1>My Sanitized Header</h1>')
    })

    it('renders UserConsent with actions', () => {
      const wrapper = mount(
        <SdkOptionsProvider options={defaultOptions}>
          <MockedLocalised>
            <UserConsent {...defaultProps} />
          </MockedLocalised>
        </SdkOptionsProvider>
      )

      expect(wrapper.exists()).toBeTruthy()
      expect(wrapper.find('Actions').exists()).toBeTruthy()
    })

    it('renders UserConsent sanitized HTML', () => {
      const wrapper = mount(
        <SdkOptionsProvider options={defaultOptions}>
          <MockedLocalised>
            <UserConsent {...defaultProps} />
          </MockedLocalised>
        </SdkOptionsProvider>
      )
      // In Enzyme v3 you need to use `render()` to see the HTML inside `dangerouslySetInnerHTML`
      // See the following issues https://github.com/enzymejs/enzyme/issues/419 and https://github.com/enzymejs/enzyme/issues/1297

      expect(wrapper.render().html()).toContain('<h1>My Sanitized Header</h1>')
    })

    it('renders the DeclineModal component', () => {
      const wrapper = mount(
        <SdkOptionsProvider options={defaultOptions}>
          <MockedLocalised>
            <UserConsent {...defaultProps} />
          </MockedLocalised>
        </SdkOptionsProvider>
      )
      const secondaryBtn = wrapper.find(
        'button[data-onfido-qa="userConsentBtnSecondary"]'
      )
      expect(secondaryBtn.exists()).toBeTruthy()
      secondaryBtn.simulate('click')
      expect(wrapper.find('DeclineModal').exists()).toBeTruthy()
    })
  })
})
