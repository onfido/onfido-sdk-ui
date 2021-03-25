import { h } from 'preact'
import { mount, shallow, ReactWrapper } from 'enzyme'

import MockedContainerDimensions from '~jest/MockedContainerDimensions'
import DocumentOverlay, { DocumentSizes } from '../DocumentOverlay'
import type { DocumentTypes } from '~types/steps'

const assertHollowSize = (wrapper: ReactWrapper, size: DocumentSizes) => {
  expect(wrapper.find('.placeholder').exists()).toBeFalsy()
  const svg = wrapper.find('.document svg')
  expect(svg.exists()).toBeTruthy()
  expect(svg.prop('data-size')).toEqual(size)
}

const assertHollowDraw = (wrapper: ReactWrapper, width: number) => {
  const hollow = wrapper.find('.hollow')
  expect(hollow.exists()).toBeTruthy()

  const hollowDraw = hollow.prop('d')

  if (!hollowDraw) {
    return
  }

  expect(hollowDraw.match(`h ${width}`)).toBeTruthy()
  expect(hollowDraw.match(`h -${width}`)).toBeTruthy()
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
        const wrapper = mount(
          <MockedContainerDimensions>
            <DocumentOverlay />
          </MockedContainerDimensions>
        )
        expect(wrapper.find('.document').exists()).toBeTruthy()

        assertHollowSize(wrapper, 'rectangle')
        assertHollowDraw(wrapper, 70)

        const fullScreen = wrapper.find('.fullScreen')
        expect(fullScreen.exists()).toBeTruthy()
      })

      it('draws bigger hollow in smaller viewports', () => {
        const wrapper = mount(
          <MockedContainerDimensions width={Infinity} height={Infinity}>
            <DocumentOverlay />
          </MockedContainerDimensions>
        )

        assertHollowDraw(wrapper, 90)
      })

      it('renders correctly with marginBottom', () => {
        const wrapper = mount(
          <MockedContainerDimensions>
            <DocumentOverlay marginBottom={0.5} />
          </MockedContainerDimensions>
        )
        expect(wrapper.exists()).toBeTruthy()
      })

      describe('with placeholder', () => {
        const paperIdCases = [false, true]
        const cardPlaceholderCases: Array<DocumentTypes | undefined> = [
          undefined,
          'driving_licence',
          'national_identity_card',
        ]

        it('renders passport placeholder when documentType=passport', () => {
          const wrapper = mount(
            <MockedContainerDimensions>
              <DocumentOverlay documentType="passport" withPlaceholder />
            </MockedContainerDimensions>
          )
          assertPlaceholder(wrapper, 'passport')
        })

        paperIdCases.forEach((isPaperId) => {
          cardPlaceholderCases.forEach((documentType) => {
            it(`renders card placeholder when documentType=${documentType} & isPaperId=${isPaperId}`, () => {
              const wrapper = mount(
                <MockedContainerDimensions>
                  <DocumentOverlay
                    documentType={documentType}
                    isPaperId={isPaperId}
                    withPlaceholder
                  />
                </MockedContainerDimensions>
              )
              assertPlaceholder(wrapper, 'card')
            })
          })

          it(`renders correct FR DL placeholder when documentType=driving_licence & issuingCountry=FR & isPaperId=${isPaperId}`, () => {
            const wrapper = mount(
              <MockedContainerDimensions>
                <DocumentOverlay
                  documentType="driving_licence"
                  isPaperId={isPaperId}
                  issuingCountry="FR"
                  withPlaceholder
                />
              </MockedContainerDimensions>
            )
            assertPlaceholder(wrapper, isPaperId ? 'frPaperDl' : 'card')
          })

          it(`renders correct IT ID placeholder when documentType=national_identity_card & issuingCountry=IT & isPaperId=${isPaperId}`, () => {
            const wrapper = mount(
              <MockedContainerDimensions>
                <DocumentOverlay
                  documentType="national_identity_card"
                  isPaperId={isPaperId}
                  issuingCountry="IT"
                  withPlaceholder
                />
              </MockedContainerDimensions>
            )
            assertPlaceholder(wrapper, isPaperId ? 'itPaperId' : 'card')
          })
        })
      })

      describe('with a specific documentType', () => {
        const paperIdCases = [false, true]

        it('renders id1 size', () => {
          const wrapper = mount(
            <MockedContainerDimensions>
              <DocumentOverlay documentType="driving_licence" />
            </MockedContainerDimensions>
          )
          assertHollowSize(wrapper, 'id1Card')
        })

        it('renders id3 size', () => {
          const wrapper = mount(
            <MockedContainerDimensions>
              <DocumentOverlay documentType="passport" />
            </MockedContainerDimensions>
          )
          assertHollowSize(wrapper, 'id3Card')
        })

        paperIdCases.forEach((isPaperId) => {
          it(`renders correct size for FR DL when isPaperId=${isPaperId}`, () => {
            const wrapper = mount(
              <MockedContainerDimensions>
                <DocumentOverlay
                  documentType="driving_licence"
                  isPaperId={isPaperId}
                  issuingCountry="FR"
                />
              </MockedContainerDimensions>
            )
            assertHollowSize(wrapper, isPaperId ? 'frPaperDl' : 'id1Card')
          })

          it(`renders correct size for IT ID when isPaperId=${isPaperId}`, () => {
            const wrapper = mount(
              <MockedContainerDimensions>
                <DocumentOverlay
                  documentType="national_identity_card"
                  isPaperId={isPaperId}
                  issuingCountry="IT"
                />
              </MockedContainerDimensions>
            )
            assertHollowSize(wrapper, isPaperId ? 'itPaperId' : 'id1Card')
          })
        })
      })
    })
  })
})
