import { h } from 'preact'
import { mount, shallow } from 'enzyme'

import DocumentOverlay from '../DocumentOverlay'

const OUTER_FRAME = 'M0,0 h100 v75 h-100 Z'

describe('Overlay', () => {
  describe('DocumentOverlay', () => {
    it('renders without crashing', () => {
      const wrapper = shallow(<DocumentOverlay />)
      expect(wrapper.exists()).toBeTruthy()
    })

    describe('when mounted', () => {
      it('renders a rectangle hollow by default', () => {
        const wrapper = mount(<DocumentOverlay />)
        expect(wrapper.find('.document').exists()).toBeTruthy()
        expect(wrapper.find('.document svg').exists()).toBeTruthy()

        const highlight = wrapper.find('.highlight')
        const highlightDraw = highlight.prop('d')
        expect(highlight.exists()).toBeTruthy()

        if (!highlightDraw) {
          // To trigger failed test
          expect(highlightDraw).toBeDefined()
          return
        }

        // `highlight` path shouldn't contain OUTER_FRAME
        expect(highlightDraw.match(OUTER_FRAME)).toBeFalsy()

        // `highlight` path should contain parallel top & bottom lines
        expect(highlightDraw.match('l 90 0')).toBeTruthy()
        expect(highlightDraw.match('l -90 0')).toBeTruthy()

        const hollow = wrapper.find('.hollow')
        expect(hollow.exists()).toBeTruthy()

        // `hollow` path should contain both OUTER_FRAME and `highlight` path
        const hollowDraw = hollow.prop('d')

        if (hollowDraw) {
          expect(hollowDraw.match(OUTER_FRAME)).toBeTruthy()
          expect(hollowDraw?.match(highlightDraw)).toBeTruthy()
        }
      })

      it('renders a perspective rectangle when tilt', () => {
        const wrapper = mount(<DocumentOverlay tilt="right" />)
        expect(wrapper.find('.document').exists()).toBeTruthy()
        expect(wrapper.find('.document svg').exists()).toBeTruthy()

        const highlight = wrapper.find('.highlight')
        const highlightDraw = highlight.prop('d')
        expect(highlight.exists()).toBeTruthy()

        if (!highlightDraw) {
          // To trigger failed test
          expect(highlightDraw).toBeDefined()
          return
        }

        // `highlight` path shouldn't contain parallel top & bottom lines
        expect(highlightDraw.match('l 90 0')).toBeFalsy()
        expect(highlightDraw.match('l -90 0')).toBeFalsy()

        const hollow = wrapper.find('.hollow')
        expect(hollow.exists()).toBeTruthy()

        // `hollow` path should contain `highlight` path
        expect(hollow.prop('d')?.match(highlightDraw)).toBeTruthy()
      })

      describe('with placeholder', () => {
        it('renders placeholder when withPlaceholder=true', () => {
          const wrapper = mount(
            <DocumentOverlay tilt="right" withPlaceholder />
          )

          expect(wrapper.find('.placeholder').exists()).toBeTruthy()
        })
      })
    })
  })
})
