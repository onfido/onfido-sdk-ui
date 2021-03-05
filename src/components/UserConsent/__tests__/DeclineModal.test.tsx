import { h } from 'preact'
import { mount, shallow } from 'enzyme'

import DeclineModal from '../DeclineModal'
import MockedLocalised from '~jest/MockedLocalised'

const defaultProps = {
  isOpen: true,
  onRequestClose: jest.fn(),
  containerEl: document.createElement('div'),
  onDismissModal: jest.fn(),
  onAbandonFlow: jest.fn(),
}

describe('DeclineModal', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(
      <MockedLocalised>
        <DeclineModal {...defaultProps} />
      </MockedLocalised>
    )
    expect(wrapper.exists()).toBeTruthy()
  })

  describe('when mounted', () => {
    it('renders without crashing', () => {
      const wrapper = mount(
        <MockedLocalised>
          <DeclineModal {...defaultProps} />
        </MockedLocalised>
      )
      const primaryBtn = wrapper.find({
        'data-onfido-qa': 'userConsentDeclineModalBtnPrimary',
      })

      const secondaryBtn = wrapper.find({
        'data-onfido-qa': 'userConsentDeclineModalBtnSecondary',
      })

      expect(wrapper.exists()).toBeTruthy()
      expect(primaryBtn.exists()).toBeTruthy()
      expect(secondaryBtn.exists()).toBeTruthy()
    })
  })
})
