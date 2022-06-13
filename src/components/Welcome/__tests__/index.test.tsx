import { h } from 'preact'
import { mount, shallow, ReactWrapper } from 'enzyme'

import { SdkOptionsProvider } from '~contexts/useSdkOptions'
import MockedLocalised from '~jest/MockedLocalised'
import MockedReduxProvider, {
  mockedReduxProps,
} from '~jest/MockedReduxProvider'
import Welcome from '../index'

import type { NarrowSdkOptions } from '~types/commons'
import type { StepComponentBaseProps } from '~types/routers'

const defaultOptions: NarrowSdkOptions = {
  steps: [{ type: 'welcome' }, { type: 'document' }],
}

const defaultProps: StepComponentBaseProps = {
  ...mockedReduxProps,
  ...defaultOptions,
  allowCrossDeviceFlow: true,
  back: jest.fn(),
  changeFlowTo: jest.fn(),
  componentsList: [
    { component: Welcome, step: { type: 'welcome' }, stepIndex: 0 },
  ],
  nextStep: jest.fn(),
  previousStep: jest.fn(),
  triggerOnError: jest.fn(),
  resetSdkFocus: jest.fn(),
  trackScreen: jest.fn(),
  step: 0,
  completeStep: jest.fn(),
}

const findButton = (wrapper: ReactWrapper) =>
  wrapper.find({ 'data-onfido-qa': 'welcome-next-btn' })

describe('Welcome', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<Welcome {...defaultProps} />)
    expect(wrapper.exists()).toBeTruthy()
  })

  describe('when mounted', () => {
    it('renders Welcome with correct elements', () => {
      const wrapper = mount(
        <MockedReduxProvider>
          <SdkOptionsProvider options={defaultOptions}>
            <MockedLocalised>
              <Welcome {...defaultProps} />
            </MockedLocalised>
          </SdkOptionsProvider>
        </MockedReduxProvider>
      )

      expect(wrapper.exists()).toBeTruthy()
      expect(wrapper.find('PageTitle .title').text()).toEqual('welcome.title')
      expect(wrapper.find('PageTitle .subTitle').text()).toEqual(
        'welcome.subtitle'
      )
      expect(wrapper.find('DefaultContent').exists()).toBeTruthy()
      expect(wrapper.find('DocVideoContent').exists()).toBeFalsy()
      expect(wrapper.find('WelcomeActions').exists()).toBeTruthy()
      expect(findButton(wrapper).text()).toEqual('welcome.next_button')
    })

    it('renders correct PageTitle with no welcome step', () => {
      const wrapper = mount(
        <MockedReduxProvider>
          <SdkOptionsProvider options={{ steps: [] }}>
            <MockedLocalised>
              <Welcome {...defaultProps} />
            </MockedLocalised>
          </SdkOptionsProvider>
        </MockedReduxProvider>
      )

      expect(wrapper.exists()).toBeTruthy()
      expect(wrapper.find('PageTitle .title').text()).toEqual('welcome.title')
      expect(wrapper.find('PageTitle .subTitle').text()).toEqual(
        'welcome.subtitle'
      )
    })

    it('renders correct PageTitle with custom title', () => {
      const wrapper = mount(
        <MockedReduxProvider>
          <SdkOptionsProvider
            options={{
              steps: [{ type: 'welcome', options: { title: 'Fake title' } }],
            }}
          >
            <MockedLocalised>
              <Welcome {...defaultProps} />
            </MockedLocalised>
          </SdkOptionsProvider>
        </MockedReduxProvider>
      )

      expect(wrapper.exists()).toBeTruthy()
      expect(wrapper.find('PageTitle .title').text()).toEqual('Fake title')
      expect(wrapper.find('PageTitle .subTitle').text()).toEqual(
        'welcome.subtitle'
      )
    })

    describe('with document video step', () => {
      const options: NarrowSdkOptions = {
        ...defaultOptions,
        steps: [
          { type: 'welcome' },
          { type: 'document', options: { requestedVariant: 'video' } },
        ],
      }

      it('renders Welcome with correct elements', () => {
        const wrapper = mount(
          <MockedReduxProvider>
            <SdkOptionsProvider options={options}>
              <MockedLocalised>
                <Welcome {...defaultProps} />
              </MockedLocalised>
            </SdkOptionsProvider>
          </MockedReduxProvider>
        )

        expect(wrapper.exists()).toBeTruthy()
        expect(wrapper.find('PageTitle .title').text()).toEqual('welcome.title')
        expect(wrapper.find('PageTitle .subTitle').text()).toEqual(
          'welcome.subtitle'
        )
        expect(wrapper.find('DefaultContent').exists()).toBeFalsy()
        expect(wrapper.find('DocVideoContent').exists()).toBeTruthy()
        expect(wrapper.find('WelcomeActions').exists()).toBeTruthy()

        expect(findButton(wrapper).text()).toEqual('welcome.next_button')
      })
    })
  })
})
