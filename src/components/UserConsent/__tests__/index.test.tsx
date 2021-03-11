import { h } from 'preact'
import { mount, shallow } from 'enzyme'
import { sanitize } from 'dompurify'

import UserConsent from '../index'
import MockedLocalised from '~jest/MockedLocalised'
import { mockedReduxProps } from '~jest/MockedReduxProvider'
import type { StepComponentUserConsentProps } from '~types/routers'

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

const defaultOptions: StepComponentUserConsentProps = {
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

describe('UserConsent', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<UserConsent {...defaultOptions} />)
    expect(wrapper.exists()).toBeTruthy()
  })

  describe('when mounted', () => {
    beforeEach(() => {
      const sanitizer = sanitize as jest.Mock
      sanitizer.mockReturnValueOnce(xhrMock.response)
    })

    it('renders UserConsent with actions', () => {
      const wrapper = mount(
        <MockedLocalised>
          <UserConsent {...defaultOptions} />
        </MockedLocalised>
      )

      expect(wrapper.exists()).toBeTruthy()
      expect(wrapper.find('Actions').exists()).toBeTruthy()
    })

    it('renders UserConsent sanitized HTML', () => {
      const wrapper = mount(
        <MockedLocalised>
          <UserConsent {...defaultOptions} />
        </MockedLocalised>
      )
      // In Enzyme v3 you need to use `render()` to see the HTML inside `dangerouslySetInnerHTML`
      // See the following issues https://github.com/enzymejs/enzyme/issues/419 and https://github.com/enzymejs/enzyme/issues/1297

      expect(wrapper.find('ScreenLayout').render().html()).toContain(
        xhrMock.response
      )
    })

    it('renders the DeclineModal component', () => {
      const wrapper = mount(
        <MockedLocalised>
          <UserConsent {...defaultOptions} />
        </MockedLocalised>
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
