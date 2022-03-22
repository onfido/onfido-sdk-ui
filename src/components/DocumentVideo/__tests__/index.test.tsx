import { h } from 'preact'
import { mount, ReactWrapper } from 'enzyme'

import MockedContainerDimensions from '~jest/MockedContainerDimensions'
import MockedLocalised from '~jest/MockedLocalised'
import MockedReduxProvider from '~jest/MockedReduxProvider'
import { fakeCapturePayload } from '~jest/captures'
import { trackException } from 'Tracker'
import DocumentOverlay, {
  Props as DocumentOverlayProps,
} from '../../Overlay/DocumentOverlay'
import FallbackButton, {
  Props as FallbackButtonProps,
} from '../../Button/FallbackButton'
import VideoCapture, { VideoCaptureProps } from '../../VideoCapture'

import DocumentVideo, { Props as DocumentVideoProps } from '../index'
import CaptureControls, {
  Props as CaptureControlsProps,
} from '../CaptureControls'

import type { CountryData } from '~types/commons'
import type { CaptureFlows } from '~types/docVideo'
import type { DocumentTypes } from '~types/steps'

jest.mock('~utils')
jest.mock('Tracker')
navigator.vibrate = jest.fn()

const EXPECTED_VIDEO_CAPTURE = {
  INACTIVE_TIMEOUT: 12,
  FACE_VIDEO_TIMEOUT: 20,
  DOC_VIDEO_TIMEOUT: 30,
}

const EXPECTED_DOC_VIDEO_CAPTURE = {
  BUTTON_VISIBILITY_TIMEOUT: 3000,
  CAMERA_OVERLAY_TIMEOUT: 3000,
  HOLDING_STILL_TIMEOUT: 6000,
  SUCCESS_STATE_TIMEOUT: 2000,
  SUCCESS_STATE_VIBRATION: 500,
}

const defaultProps: DocumentVideoProps = {
  cameraClassName: 'fakeCameraClass',
  documentType: 'driving_licence',
  onCapture: jest.fn(),
  renderFallback: jest.fn(),
  trackScreen: jest.fn(),
}

const waitForTimeout = (
  wrapper: ReactWrapper,
  type: 'button' | 'holding' | 'success' | 'recording',
  forceRerender = false
) => {
  switch (type) {
    case 'button':
      jest.advanceTimersByTime(
        EXPECTED_DOC_VIDEO_CAPTURE.BUTTON_VISIBILITY_TIMEOUT
      )
      break
    case 'holding':
      jest.advanceTimersByTime(EXPECTED_DOC_VIDEO_CAPTURE.HOLDING_STILL_TIMEOUT)
      break
    case 'success':
      jest.advanceTimersByTime(EXPECTED_DOC_VIDEO_CAPTURE.SUCCESS_STATE_TIMEOUT)
      break
    case 'recording':
      jest.advanceTimersByTime(EXPECTED_VIDEO_CAPTURE.DOC_VIDEO_TIMEOUT * 1000)
      break
    default:
      break
  }

  wrapper.update()

  if (forceRerender) {
    // Force rerender to trigger useEffect in DocumentVideo
    // https://github.com/enzymejs/enzyme/issues/2091#issuecomment-486680844
    wrapper.setProps({})
  }
}

const simulateButtonClick = (wrapper: ReactWrapper) =>
  wrapper.find({ 'data-onfido-qa': 'doc-video-capture-btn' }).simulate('click')

const assertOverlay = (
  wrapper: ReactWrapper,
  documentType: DocumentTypes,
  withPlaceholder: boolean
) => {
  const documentOverlay = wrapper.find<DocumentOverlayProps>(DocumentOverlay)
  expect(documentOverlay.exists()).toBeTruthy()
  expect(documentOverlay.props().documentType).toEqual(documentType)
  expect(documentOverlay.props().withPlaceholder).toEqual(withPlaceholder)
}

const assertRecordingButton = (wrapper: ReactWrapper, text: string) => {
  const recordingButton = wrapper.find({
    'data-onfido-qa': 'doc-video-capture-btn',
  })
  expect(recordingButton.exists()).toBeTruthy()
  expect(recordingButton.prop('disabled')).toBeFalsy()
  expect(recordingButton.text()).toEqual(text)
}

const assertIntroStep = (
  wrapper: ReactWrapper,
  forSingleSidedDocs: boolean
) => {
  const videoCapture = wrapper.find<VideoCaptureProps>(VideoCapture)
  expect(videoCapture.exists()).toBeTruthy()
  expect(wrapper.find('PaperIdFlowSelector').exists()).toBeFalsy()

  const {
    cameraClassName,
    facing,
    inactiveError,
    onRedo,
    renderFallback,
    trackScreen,
  } = videoCapture.props()

  expect(cameraClassName).toEqual('fakeCameraClass')
  expect(facing).toEqual('environment')
  expect(inactiveError.name).toEqual('CAMERA_INACTIVE_NO_FALLBACK')

  expect(onRedo).toBeDefined()

  renderFallback({ text: 'Fake fallback action', type: 'fallback' })
  expect(defaultProps.renderFallback).toHaveBeenCalledWith({
    text: 'Fake fallback action',
    type: 'fallback',
  })
  trackScreen('fake_screen_tracking')
  expect(defaultProps.trackScreen).toHaveBeenCalledWith('fake_screen_tracking')

  assertRecordingButton(wrapper, 'video_capture.button_primary_start')

  const instructions = wrapper.find('CaptureControls Instructions')
  expect(instructions.exists()).toBeTruthy()

  if (forSingleSidedDocs) {
    expect(instructions.props()).toMatchObject({
      title: 'doc_video_capture.header_passport',
    })
  } else {
    expect(instructions.props()).toMatchObject({
      title: 'doc_video_capture.header',
    })
  }
}

const assertFirstStep = (wrapper: ReactWrapper) => {
  waitForTimeout(wrapper, 'button')
  assertRecordingButton(wrapper, 'doc_video_capture.button_primary_fallback')

  const instructions = wrapper.find('CaptureControls Instructions')
  expect(instructions.exists()).toBeTruthy()

  expect(instructions.props()).toMatchObject({
    title: 'doc_video_capture.header_step1',
  })
}

const assertSecondStep = (wrapper: ReactWrapper) => {
  waitForTimeout(wrapper, 'button')
  assertRecordingButton(
    wrapper,
    'doc_video_capture.button_primary_fallback_end'
  )

  const instructions = wrapper.find('CaptureControls Instructions')
  expect(instructions.exists()).toBeTruthy()

  expect(instructions.props()).toMatchObject({
    title: 'doc_video_capture.header_step2',
    subtitle: 'doc_video_capture.detail_step2',
  })
}

describe('DocumentVideo', () => {
  let wrapper: ReactWrapper

  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.clearAllTimers()
  })

  describe('with double-sided documents', () => {
    beforeEach(() => {
      wrapper = mount(
        <MockedReduxProvider>
          <MockedLocalised>
            <MockedContainerDimensions>
              <DocumentVideo {...defaultProps} />
            </MockedContainerDimensions>
          </MockedLocalised>
        </MockedReduxProvider>
      )
    })

    it('renders the video capture by default', () =>
      assertIntroStep(wrapper, false))

    it('renders overlay correctly', () => {
      assertOverlay(wrapper, 'driving_licence', true)
      jest.advanceTimersByTime(
        EXPECTED_DOC_VIDEO_CAPTURE.CAMERA_OVERLAY_TIMEOUT
      )
      wrapper.update()
      assertOverlay(wrapper, 'driving_licence', false)
    })

    describe('when recording', () => {
      beforeEach(() => simulateButtonClick(wrapper))

      it('sets correct timeout', () => {
        const timeout = wrapper.find('Timeout')
        expect(timeout.prop('seconds')).toEqual(
          EXPECTED_VIDEO_CAPTURE.DOC_VIDEO_TIMEOUT
        )
      })

      describe('when inactive timed out', () => {
        beforeEach(() => {
          waitForTimeout(wrapper, 'recording')
        })

        it('handles redo fallback correctly', () => {
          const fallbackButton = wrapper.find<FallbackButtonProps>(
            FallbackButton
          )
          const onClick = fallbackButton?.props().onClick
          onClick && onClick()
          wrapper.setProps({})

          assertRecordingButton(wrapper, 'video_capture.button_primary_start')
        })
      })

      it('starts recording correctly', () => {
        assertOverlay(wrapper, 'driving_licence', false)
        assertFirstStep(wrapper)
      })

      it('moves to the second step correctly', () => {
        waitForTimeout(wrapper, 'button')
        simulateButtonClick(wrapper)
        waitForTimeout(wrapper, 'success', true)
        assertSecondStep(wrapper)
      })

      it('ends the flow with back side captured', () => {
        waitForTimeout(wrapper, 'button')
        simulateButtonClick(wrapper)
        waitForTimeout(wrapper, 'success', true)

        waitForTimeout(wrapper, 'button')
        simulateButtonClick(wrapper)
        waitForTimeout(wrapper, 'success', true)

        expect(defaultProps.onCapture).toHaveBeenCalledWith({
          front: {
            ...fakeCapturePayload('standard'),
            filename: 'document_front.jpeg',
          },
          video: {
            ...fakeCapturePayload('video'),
            filename: 'document_video.webm',
          },
          back: {
            ...fakeCapturePayload('standard'),
            filename: 'document_back.jpeg',
          },
        })
      })
    })
  })

  describe('with passports', () => {
    beforeEach(() => {
      wrapper = mount(
        <MockedReduxProvider>
          <MockedLocalised>
            <MockedContainerDimensions>
              <DocumentVideo {...defaultProps} documentType="passport" />
            </MockedContainerDimensions>
          </MockedLocalised>
        </MockedReduxProvider>
      )
    })

    it('renders the video capture by default', () =>
      assertIntroStep(wrapper, true))

    describe('when recording', () => {
      beforeEach(() => simulateButtonClick(wrapper))

      it('starts recording correctly', () => {
        assertOverlay(wrapper, 'passport', false)
        assertFirstStep(wrapper)
      })

      it('ends the flow without capturing back side', () => {
        waitForTimeout(wrapper, 'button')
        simulateButtonClick(wrapper)
        waitForTimeout(wrapper, 'holding', true)
        waitForTimeout(wrapper, 'success', true)

        expect(defaultProps.onCapture).toHaveBeenCalledWith({
          front: {
            ...fakeCapturePayload('standard'),
            filename: 'document_front.jpeg',
          },
          video: {
            ...fakeCapturePayload('video'),
            filename: 'document_video.webm',
          },
        })
      })
    })
  })

  describe('with paper IDs', () => {
    const paperIdCases: Array<{
      documentType: DocumentTypes
      idDocumentIssuingCountry: CountryData
    }> = [
      {
        documentType: 'driving_licence',
        idDocumentIssuingCountry: {
          name: 'France',
          country_alpha2: 'FR',
          country_alpha3: 'FRA',
        },
      },
      {
        documentType: 'national_identity_card',
        idDocumentIssuingCountry: {
          name: 'Italy',
          country_alpha2: 'IT',
          country_alpha3: 'ITA',
        },
      },
    ]

    paperIdCases.forEach(({ documentType, idDocumentIssuingCountry }) => {
      describe(`for ${idDocumentIssuingCountry.name} ${documentType}`, () => {
        const possibleFlows: CaptureFlows[] = ['cardId', 'paperId']

        const simulateFlowClick = (
          wrapper: ReactWrapper,
          flow: CaptureFlows
        ) => {
          const button = wrapper.find(`PaperIdFlowSelector .${flow}`)
          button.simulate('click')
        }

        beforeEach(() => {
          wrapper = mount(
            <MockedReduxProvider overrideGlobals={{ idDocumentIssuingCountry }}>
              <MockedLocalised>
                <MockedContainerDimensions>
                  <DocumentVideo
                    {...defaultProps}
                    documentType={documentType}
                  />
                </MockedContainerDimensions>
              </MockedLocalised>
            </MockedReduxProvider>
          )
        })

        it('renders the flow selection by default', () => {
          expect(wrapper.find('PaperIdFlowSelector').exists()).toBeTruthy()
          expect(wrapper.find('CaptureControls').exists()).toBeFalsy()
        })

        it('renders overlay without automatically dismiss', () => {
          assertOverlay(wrapper, documentType, true)
          jest.advanceTimersByTime(
            EXPECTED_DOC_VIDEO_CAPTURE.CAMERA_OVERLAY_TIMEOUT
          )
          wrapper.update()
          assertOverlay(wrapper, documentType, true)
        })

        possibleFlows.forEach((flow) => {
          describe(`when select ${flow} flow`, () => {
            beforeEach(() => simulateFlowClick(wrapper, flow))

            it('starts flow correctly', () => {
              expect(wrapper.find('PaperIdFlowSelector').exists()).toBeFalsy()
              expect(wrapper.find('CaptureControls').exists()).toBeTruthy()
            })

            it('ends the flow with back side captured', () => {
              simulateButtonClick(wrapper)
              waitForTimeout(wrapper, 'button')
              simulateButtonClick(wrapper)
              waitForTimeout(wrapper, 'success', true)

              waitForTimeout(wrapper, 'button')
              simulateButtonClick(wrapper)
              waitForTimeout(wrapper, 'success', true)

              expect(defaultProps.onCapture).toHaveBeenCalledWith({
                front: {
                  ...fakeCapturePayload('standard'),
                  filename: 'document_front.jpeg',
                },
                video: {
                  ...fakeCapturePayload('video'),
                  filename: 'document_video.webm',
                },
                back: {
                  ...fakeCapturePayload('standard'),
                  filename: 'document_back.jpeg',
                },
              })
            })
          })
        })
      })
    })
  })

  describe('with empty payloads', () => {
    const mockedTrackException = trackException as jest.MockedFunction<
      typeof trackException
    >

    beforeEach(() => {
      console.error = jest.fn()

      wrapper = mount(
        <MockedReduxProvider>
          <MockedLocalised>
            <MockedContainerDimensions>
              <DocumentVideo {...defaultProps} documentType="passport" />
            </MockedContainerDimensions>
          </MockedLocalised>
        </MockedReduxProvider>
      )
    })

    it(`doesn't trigger onCapture`, () => {
      const captureControls = wrapper.find<CaptureControlsProps>(
        CaptureControls
      )

      captureControls.props().onSubmit()
      wrapper.setProps({})

      expect(mockedTrackException).toHaveBeenCalledWith(
        'Missing frontPayload or videoPayload'
      )

      expect(defaultProps.onCapture).not.toHaveBeenCalled()
    })
  })
})
