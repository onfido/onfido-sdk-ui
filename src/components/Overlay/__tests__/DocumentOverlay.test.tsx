import { h } from 'preact'
import { mount, shallow, ReactWrapper } from 'enzyme'

import DocumentOverlay, { DocumentSizes } from '../DocumentOverlay'
import type { DocumentTypes } from '~types/steps'

const OUTER_FRAME = 'M0,0 h100 v75 h-100 Z'

const assertHollowSize = (wrapper: ReactWrapper, size: DocumentSizes) => {
  expect(wrapper.find('.placeholder').exists()).toBeFalsy()
  const svg = wrapper.find('.document svg')
  expect(svg.exists()).toBeTruthy()
  expect(svg.prop('data-size')).toEqual(size)
}

const assertPlaceholder = (
  wrapper: ReactWrapper,
  name: 'card' | 'passport' | 'frPaperDl' | 'itPaperId'
) => {
  const placeholder = wrapper.find('.placeholder')
  expect(placeholder.exists()).toBeTruthy()
  expect(placeholder.hasClass('card')).toEqual('card' === name)
  expect(placeholder.hasClass('passport')).toEqual('passport' === name)
  expect(placeholder.hasClass('frPaperDl')).toEqual('frPaperDl' === name)
  expect(placeholder.hasClass('itPaperId')).toEqual('itPaperId' === name)
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

      it('renders correctly with marginBottom', () => {
        const wrapper = mount(<DocumentOverlay marginBottom={0.5} />)
        expect(wrapper.exists()).toBeTruthy()
      })

      describe('with placeholder', () => {
        const cardPlaceholderCases: Array<DocumentTypes | undefined> = [
          undefined,
          'driving_licence',
          'national_identity_card',
        ]

        cardPlaceholderCases.forEach((documentType) => {
          it('renders card placeholder by default', () => {
            const wrapper = mount(
              <DocumentOverlay documentType={documentType} withPlaceholder />
            )
            assertPlaceholder(wrapper, 'card')
          })
        })

        it('renders passport placeholder when documentType=passport', () => {
          const wrapper = mount(
            <DocumentOverlay documentType="passport" withPlaceholder />
          )
          assertPlaceholder(wrapper, 'passport')
        })

        it('renders FR DL placeholder when documentType=driving_licence & issuingCountry=fr', () => {
          const wrapper = mount(
            <DocumentOverlay
              issuingCountry="fr"
              documentType="driving_licence"
              withPlaceholder
            />
          )
          assertPlaceholder(wrapper, 'frPaperDl')
        })

        it('renders IT ID placeholder when documentType=national_identity_card & issuingCountry=it', () => {
          const wrapper = mount(
            <DocumentOverlay
              issuingCountry="it"
              documentType="national_identity_card"
              withPlaceholder
            />
          )
          assertPlaceholder(wrapper, 'itPaperId')
        })
      })

      describe('with a specific documentType', () => {
        it('renders id1 size', () => {
          const wrapper = mount(
            <DocumentOverlay documentType="driving_licence" />
          )
          assertHollowSize(wrapper, 'id1Card')
        })

        it('renders id3 size', () => {
          const wrapper = mount(<DocumentOverlay documentType="passport" />)
          assertHollowSize(wrapper, 'id3Card')
        })

        it('renders frPaperId size', () => {
          const wrapper = mount(
            <DocumentOverlay
              issuingCountry="fr"
              documentType="driving_licence"
            />
          )
          assertHollowSize(wrapper, 'frPaperDl')
        })

        it('renders itPaperId size', () => {
          const wrapper = mount(
            <DocumentOverlay
              issuingCountry="it"
              documentType="national_identity_card"
            />
          )
          assertHollowSize(wrapper, 'itPaperId')
        })
      })
    })
  })
})
