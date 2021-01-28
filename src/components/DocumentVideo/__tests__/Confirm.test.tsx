import { h } from 'preact'
import { mount, ReactWrapper } from 'enzyme'

import MockedLocalised from '~jest/MockedLocalised'
import { reduxProps } from '~jest/MockedReduxProvider'
import Confirm, { Props as ConfirmProps } from '../Confirm'

const defaultProps: ConfirmProps = {
  allowCrossDeviceFlow: true,
  back: jest.fn(),
  changeFlowTo: jest.fn(),
  nextStep: jest.fn(),
  onRedo: jest.fn(),
  previousStep: jest.fn(),
  resetSdkFocus: jest.fn(),
  step: 0,
  trackScreen: jest.fn(),
  triggerOnError: jest.fn(),
  ...reduxProps,
}

describe('DocumentVideo', () => {
  describe('Confirm', () => {
    afterEach(() => {
      jest.clearAllMocks()
    })

    it('renders buttons correctly', () => {
      const wrapper = mount(
        <MockedLocalised>
          <Confirm {...defaultProps} />
        </MockedLocalised>
      )

      expect(wrapper.find('Spinner').exists()).toBeFalsy()

      const uploadButton = wrapper.find('button.button-primary')
      expect(uploadButton.exists()).toBeTruthy()
      expect(uploadButton.text()).toEqual(
        'doc_confirmation.button_primary_upload'
      )
      expect(uploadButton.hasClass('button-lg button-centered')).toBeTruthy()

      const redoButton = wrapper.find('button.button-secondary')
      expect(redoButton.exists()).toBeTruthy()
      expect(redoButton.text()).toEqual('doc_confirmation.button_primary_redo')
      expect(redoButton.hasClass('button-lg button-centered')).toBeTruthy()
    })

    it('goes back when click on redo', () => {
      const wrapper = mount(
        <MockedLocalised>
          <Confirm {...defaultProps} />
        </MockedLocalised>
      )

      wrapper.find('button.button-secondary').simulate('click')
      expect(defaultProps.onRedo).toHaveBeenCalled()
    })

    describe('when upload', () => {
      let wrapper: ReactWrapper

      beforeEach(() => {
        wrapper = mount(
          <MockedLocalised>
            <Confirm {...defaultProps} />
          </MockedLocalised>
        )

        wrapper.find('button.button-primary').simulate('click')
      })

      it('renders spinner correctly', () => {
        expect(wrapper.find('Spinner').exists()).toBeTruthy()
        expect(wrapper.find('button.button-primary').exists()).toBeFalsy()
        expect(wrapper.find('button.button-secondary').exists()).toBeFalsy()
      })
    })
  })
})
