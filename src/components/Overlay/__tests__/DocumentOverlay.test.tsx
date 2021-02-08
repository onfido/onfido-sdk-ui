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
        expect(highlight.exists()).toBeTruthy()

        // `highlight` path shouldn't contain OUTER_FRAME
        expect(highlight.prop('d').match(OUTER_FRAME)).toBeFalsy()

        // `highlight` path should contain parallel top & bottom lines
        expect(highlight.prop('d').match('l 90 0')).toBeTruthy()
        expect(highlight.prop('d').match('l -90 0')).toBeTruthy()

        const hollow = wrapper.find('.hollow')
        expect(hollow.exists()).toBeTruthy()

        // `hollow` path should contain both OUTER_FRAME and `highlight` path
        expect(hollow.prop('d').match(OUTER_FRAME)).toBeTruthy()
        expect(hollow.prop('d').match(highlight.prop('d'))).toBeTruthy()
      })

      it('renders a perspective rectangle when tilt', () => {
        const wrapper = mount(<DocumentOverlay tilt="right" />)
        expect(wrapper.find('.document').exists()).toBeTruthy()
        expect(wrapper.find('.document svg').exists()).toBeTruthy()

        const highlight = wrapper.find('.highlight')
        expect(highlight.exists()).toBeTruthy()

        // `highlight` path shouldn't contain parallel top & bottom lines
        expect(highlight.prop('d').match('l 90 0')).toBeFalsy()
        expect(highlight.prop('d').match('l -90 0')).toBeFalsy()

        const hollow = wrapper.find('.hollow')
        expect(hollow.exists()).toBeTruthy()

        // `hollow` path should contain `highlight` path
        expect(hollow.prop('d').match(highlight.prop('d'))).toBeTruthy()
      })
    })
  })
})
