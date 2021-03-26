import { h } from 'preact'
import { mount, shallow } from 'enzyme'

import MockedLocalised from '~jest/MockedLocalised'
import PaperIdFlowSelector, {
  Props as PaperIdFlowSelectorProps,
} from '../index'

const defaultProps: PaperIdFlowSelectorProps = {
  documentType: 'driving_licence',
  onSelectFlow: jest.fn(),
}

describe('DocumentVideo', () => {
  describe('PaperIdFlowSelector', () => {
    it('renders without crashing', () => {
      const wrapper = shallow(<PaperIdFlowSelector {...defaultProps} />)
      expect(wrapper.exists()).toBeTruthy()
    })

    describe('when mounted', () => {
      it('renders nothing if documentType is not license or id', () => {
        const wrapper = mount(
          <MockedLocalised>
            <PaperIdFlowSelector {...defaultProps} documentType="passport" />
          </MockedLocalised>
        )

        expect(
          wrapper.find('PaperIdFlowSelector').children().exists()
        ).toBeFalsy()
      })

      it('renders correct items', () => {
        const wrapper = mount(
          <MockedLocalised>
            <PaperIdFlowSelector {...defaultProps} />
          </MockedLocalised>
        )

        expect(wrapper.exists()).toBeTruthy()

        expect(wrapper.find('.title').text()).toEqual(
          'doc_capture.prompt.title_license'
        )

        const cardButton = wrapper.find('button.cardId')
        expect(cardButton.text()).toEqual('doc_capture.prompt.button_card')
        cardButton.simulate('click')
        expect(defaultProps.onSelectFlow).toHaveBeenCalledWith('cardId')

        const paperButton = wrapper.find('button.paperId')
        expect(paperButton.text()).toEqual('doc_capture.prompt.button_paper')
        paperButton.simulate('click')
        expect(defaultProps.onSelectFlow).toHaveBeenCalledWith('paperId')
      })

      describe('with id card', () => {
        it('renders correct title', () => {
          const wrapper = mount(
            <MockedLocalised>
              <PaperIdFlowSelector
                {...defaultProps}
                documentType="national_identity_card"
              />
            </MockedLocalised>
          )

          expect(wrapper.find('.title').text()).toEqual(
            'doc_capture.prompt.title_id'
          )
        })
      })
    })
  })
})
