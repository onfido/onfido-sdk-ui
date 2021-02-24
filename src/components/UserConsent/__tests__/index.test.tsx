import { h } from 'preact'
import { mount, shallow } from 'enzyme'
import { sanitize } from 'dompurify'

import UserConsent from '../index'
import MockedLocalised from '~jest/MockedLocalised'
import { mockedReduxProps } from '~jest/MockedReduxProvider'
import type { StepComponentUserConsentProps } from '~types/routers'

jest.mock('dompurify')

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
      sanitizer.mockReturnValueOnce('<h1>My Sanitized Header</h1>')
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

      expect(wrapper.render().html()).toContain('<h1>My Sanitized Header</h1>')
    })
  })
})
