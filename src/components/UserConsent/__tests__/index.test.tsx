import { h } from 'preact'
import { mount, shallow } from 'enzyme'
import { sanitize } from 'dompurify'

import { SdkOptionsProvider } from '~contexts/useSdkOptions'
import MockedLocalised from '~jest/MockedLocalised'
import { mockedReduxProps } from '~jest/MockedReduxProvider'
import UserConsent from '../index'

import type { NarrowSdkOptions } from '~types/commons'
import type { StepComponentBaseProps } from '~types/routers'

jest.mock('dompurify')

const xhrMock: Partial<XMLHttpRequest> = {
  open: jest.fn(),
  send: jest.fn(),
  setRequestHeader: jest.fn(),
  readyState: 4,
  status: 200,
  response: '<h1>My Sanitized Header</h1>',
}

jest
  .spyOn(window, 'XMLHttpRequest')
  .mockImplementation(() => xhrMock as XMLHttpRequest)

const defaultOptions: NarrowSdkOptions = {
  steps: [{ type: 'welcome' }, { type: 'userConsent' }],
}

const defaultProps: StepComponentBaseProps = {
  ...defaultOptions,
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
  step: 0,
}

describe('UserConsent', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<UserConsent {...defaultProps} />)
    expect(wrapper.exists()).toBeTruthy()
  })

  describe('when mounted', () => {
    beforeEach(() => {
      const sanitizer = sanitize as jest.Mock
      sanitizer.mockReturnValueOnce(xhrMock.response)
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

      expect(wrapper.find('ScreenLayout').render().html()).toContain(
        xhrMock.response
      )
    })

    it('renders the DeclineModal component', () => {
      const wrapper = mount(
        <SdkOptionsProvider options={defaultOptions}>
          <MockedLocalised>
            <UserConsent {...defaultProps} />
          </MockedLocalised>
        </SdkOptionsProvider>
      )
      const secondaryBtn = wrapper.find({
        'data-onfido-qa': 'userConsentBtnSecondary',
      })
      expect(secondaryBtn.exists()).toBeTruthy()
      secondaryBtn.simulate('click')
      expect(wrapper.find('DeclineModal').exists()).toBeTruthy()
    })
  })
})
