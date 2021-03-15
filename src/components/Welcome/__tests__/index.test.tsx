import { h } from 'preact'
import { mount, shallow } from 'enzyme'

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
}

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
      expect(wrapper.find('PageTitle').text()).toEqual('welcome.title')

      const descriptions = wrapper.find('DefaultContent .text p')
      expect(descriptions.at(0).text()).toMatch('welcome.description_p_1')
      expect(descriptions.at(1).text()).toMatch('welcome.description_p_2')

      expect(wrapper.find('DocVideoContent').exists()).toBeFalsy()
      expect(wrapper.find('WelcomeActions > Button').text()).toEqual(
        'welcome.next_button'
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
        expect(wrapper.find('PageTitle').text()).toEqual('welcome.title')
        expect(wrapper.find('DefaultContent').exists()).toBeFalsy()
        expect(wrapper.find('WelcomeActions').exists()).toBeTruthy()

        expect(wrapper.find('DocVideoContent .caption').text()).toEqual(
          'doc_video_capture.welcome.caption'
        )
        const items = wrapper.find('DocVideoContent .instructions > li')
        expect(items.at(0).text()).toEqual(
          'doc_video_capture.welcome.instruction_item_1'
        )
        expect(items.at(1).text()).toEqual(
          'doc_video_capture.welcome.instruction_item_2'
        )
        expect(wrapper.find('.recordingLimit').text()).toEqual(
          'doc_video_capture.welcome.limit'
        )

        expect(wrapper.find('WelcomeActions > Button').text()).toEqual(
          'doc_video_capture.welcome.next_button'
        )
      })
    })
  })
})
