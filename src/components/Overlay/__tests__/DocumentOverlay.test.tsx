import { h } from 'preact'
import { mount, shallow, ReactWrapper } from 'enzyme'

import DocumentOverlay from '../DocumentOverlay'

const OUTER_FRAME = 'M0,0 h100 v75 h-100 Z'

const assertHollowSize = (
  wrapper: ReactWrapper,
  type: 'rectangle' | 'id1Card' | 'id3Card'
) => {
  expect(wrapper.find('.placeholder').exists()).toBeFalsy()
  const svg = wrapper.find('.document svg')
  expect(svg.exists()).toBeTruthy()
  expect(svg.prop('data-size')).toEqual(type)
}

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

        assertHollowSize(wrapper, 'rectangle')

        const hollow = wrapper.find('.hollow')
        const hollowDraw = hollow.prop('d')
        expect(hollow.exists()).toBeTruthy()

        if (!hollowDraw) {
          // To trigger failed test
          expect(hollowDraw).toBeDefined()
          return
        }

        // `hollow` path shouldn't contain OUTER_FRAME
        expect(hollowDraw.match(OUTER_FRAME)).toBeFalsy()

        // `hollow` path should contain parallel top & bottom lines
        expect(hollowDraw.match('l 90 0')).toBeTruthy()
        expect(hollowDraw.match('l -90 0')).toBeTruthy()

        const fullScreen = wrapper.find('.fullScreen')
        expect(fullScreen.exists()).toBeTruthy()

        // `fullScreen` path should contain both OUTER_FRAME and `hollow` path
        const fullScreenDraw = fullScreen.prop('d')

        if (fullScreenDraw) {
          expect(fullScreenDraw.match(OUTER_FRAME)).toBeTruthy()
          expect(fullScreenDraw.match(hollowDraw)).toBeTruthy()
        }
      })

      describe('with placeholder', () => {
        it('renders placeholder when withPlaceholder=true', () => {
          const wrapper = mount(
            <DocumentOverlay marginBottom={10} withPlaceholder />
          )
          expect(wrapper.find('.placeholder').exists()).toBeTruthy()
        })
      })

      describe('with a specific type', () => {
        it('renders id1 size', () => {
          const wrapper = mount(<DocumentOverlay type="driving_licence" />)
          assertHollowSize(wrapper, 'id1Card')
        })

        it('renders id3 size', () => {
          const wrapper = mount(<DocumentOverlay type="passport" />)
          assertHollowSize(wrapper, 'id3Card')
        })
      })
    })
  })
})
