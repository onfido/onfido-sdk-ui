import { h } from 'preact'
import { mount, shallow } from 'enzyme'

import MockedReduxProvider from '~jest/MockedReduxProvider'
import MockedLocalised from '~jest/MockedLocalised'
import PaperIdFlowSelector, {
  Props as PaperIdFlowSelectorProps,
} from '../PaperIdFlowSelector'

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
          <MockedReduxProvider>
            <MockedLocalised>
              <PaperIdFlowSelector {...defaultProps} documentType="passport" />
            </MockedLocalised>
          </MockedReduxProvider>
        )

        expect(
          wrapper.find('PaperIdFlowSelector').children().exists()
        ).toBeFalsy()
      })

      it('renders correct items', () => {
        const wrapper = mount(
          <MockedReduxProvider>
            <MockedLocalised>
              <PaperIdFlowSelector {...defaultProps} />
            </MockedLocalised>
          </MockedReduxProvider>
        )

        expect(wrapper.exists()).toBeTruthy()

        const documentOverlay = wrapper.find('DocumentOverlay')
        expect(documentOverlay.exists()).toBeTruthy()
        expect(documentOverlay.props()).toMatchObject({ marginBottom: 0.5 })

        expect(wrapper.find('ToggleFullScreen').exists()).toBeTruthy()

        const footer = wrapper.find('.footer')
        expect(footer.find('.title').text()).toEqual(
          'doc_capture.prompt.title_license'
        )

        const cardButton = footer.find('button.cardId')
        expect(cardButton.text()).toEqual('doc_capture.prompt.button_card')
        cardButton.simulate('click')
        expect(defaultProps.onSelectFlow).toHaveBeenCalledWith('cardId')

        const paperButton = footer.find('button.paperId')
        expect(paperButton.text()).toEqual('doc_capture.prompt.button_paper')
        paperButton.simulate('click')
        expect(defaultProps.onSelectFlow).toHaveBeenCalledWith('paperId')
      })

      describe('with id card', () => {
        it('renders correct title', () => {
          const wrapper = mount(
            <MockedReduxProvider>
              <MockedLocalised>
                <PaperIdFlowSelector
                  {...defaultProps}
                  documentType="national_identity_card"
                />
              </MockedLocalised>
            </MockedReduxProvider>
          )

          expect(wrapper.find('.footer .title').text()).toEqual(
            'doc_capture.prompt.title_id'
          )
        })
      })
    })
  })
})
