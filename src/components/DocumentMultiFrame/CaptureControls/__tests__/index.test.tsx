import { h } from 'preact'
import { mount, ReactWrapper } from 'enzyme'

import { DOCUMENT_MULTI_FRAME_HEADER_MAPPING } from '~utils/localesMapping'
import MockedLocalised from '~jest/MockedLocalised'
import MockedVideoCapture from '~jest/MockedVideoCapture'
import CaptureControls from '../index'

import type { DocumentSides } from '~types/commons'
import type { DocumentTypes } from '~types/steps'

jest.mock('../../../VideoCapture')

const EXPECTED_DOC_MULTI_FRAME_CAPTURE = {
  CAPTURE_DURATION: 6000,
  SUCCESS_STATE_TIMEOUT: 2000,
}

const defaultProps = {
  documentType: 'passport' as DocumentTypes,
  onSubmit: jest.fn(),
  side: 'front' as DocumentSides,
}

const assertCameraButton = (wrapper: ReactWrapper) => {
  const button = wrapper.find('CameraButton > button')

  expect(button.prop('aria-label')).toEqual(
    'selfie_capture.button_accessibility'
  )
}

const assertControls = (
  wrapper: ReactWrapper,
  stage: 'default' | 'recording' | 'success'
) => {
  switch (stage) {
    case 'default': {
      expect(wrapper.find('Instructions').exists()).toBeTruthy()
      expect(wrapper.find('CaptureProgress').exists()).toBeFalsy()
      expect(wrapper.find('SuccessState').exists()).toBeFalsy()
      expect(wrapper.find('CameraButton').exists()).toBeTruthy()
      break
    }

    case 'recording': {
      expect(wrapper.find('Instructions').exists()).toBeTruthy()
      expect(wrapper.find('CaptureProgress').exists()).toBeTruthy()
      expect(wrapper.find('SuccessState').exists()).toBeFalsy()
      expect(wrapper.find('CameraButton').exists()).toBeFalsy()
      break
    }

    case 'success': {
      expect(wrapper.find('Instructions').exists()).toBeFalsy()
      expect(wrapper.find('CaptureProgress').exists()).toBeFalsy()
      expect(wrapper.find('SuccessState').exists()).toBeTruthy()
      expect(wrapper.find('CameraButton').exists()).toBeFalsy()
      break
    }
  }
}

describe('DocumentMultiFrame', () => {
  describe('CaptureControls', () => {
    beforeAll(() => {
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.clearAllMocks()
      jest.clearAllTimers()
    })

    it('renders without crashing', () => {
      const wrapper = mount(
        <MockedLocalised>
          <MockedVideoCapture
            renderVideoOverlay={(props) => (
              <CaptureControls {...props} {...defaultProps} />
            )}
          />
        </MockedLocalised>
      )

      expect(wrapper.exists()).toBeTruthy()
      assertControls(wrapper, 'default')
      expect(wrapper.find('Instructions').text()).toEqual(
        'doc_capture.header.passport'
      )
      assertCameraButton(wrapper)
    })

    describe('when recording', () => {
      let wrapper: ReactWrapper

      beforeEach(() => {
        wrapper = mount(
          <MockedLocalised>
            <MockedVideoCapture
              renderVideoOverlay={(props) => (
                <CaptureControls {...props} {...defaultProps} />
              )}
            />
          </MockedLocalised>
        )

        wrapper.find('CameraButton > button').simulate('click')
      })

      it('starts recording correctly', () => {
        assertControls(wrapper, 'recording')
        expect(wrapper.find('CaptureProgress').prop('duration')).toEqual(
          EXPECTED_DOC_MULTI_FRAME_CAPTURE.CAPTURE_DURATION
        )
        expect(wrapper.find('Instructions').text()).toEqual(
          'doc_capture.header.progress'
        )
      })

      it('stops recording after timeout', () => {
        jest.advanceTimersByTime(
          EXPECTED_DOC_MULTI_FRAME_CAPTURE.CAPTURE_DURATION
        )
        wrapper.update()
        assertControls(wrapper, 'success')
        expect(defaultProps.onSubmit).not.toHaveBeenCalled()
      })

      it('submits captures after timeout', () => {
        jest.advanceTimersByTime(
          EXPECTED_DOC_MULTI_FRAME_CAPTURE.CAPTURE_DURATION
        )
        wrapper.update()

        jest.advanceTimersByTime(
          EXPECTED_DOC_MULTI_FRAME_CAPTURE.SUCCESS_STATE_TIMEOUT
        )
        wrapper.update()

        expect(defaultProps.onSubmit).toHaveBeenCalled()
      })
    })

    describe('with different types of document', () => {
      const documentTypes: DocumentTypes[] = [
        'driving_licence',
        'national_identity_card',
        'residence_permit',
      ]
      const documentSides: DocumentSides[] = ['front', 'back']

      documentTypes.forEach((documentType) => {
        documentSides.forEach((side) => {
          it(`renders correct title with ${side} ${documentType}`, () => {
            const passedProps = { ...defaultProps, documentType, side }

            const wrapper = mount(
              <MockedLocalised>
                <MockedVideoCapture
                  renderVideoOverlay={(props) => (
                    <CaptureControls {...props} {...passedProps} />
                  )}
                />
              </MockedLocalised>
            )

            expect(wrapper.find('Instructions').text()).toEqual(
              DOCUMENT_MULTI_FRAME_HEADER_MAPPING[documentType][side]
            )
          })
        })
      })
    })
  })
})
