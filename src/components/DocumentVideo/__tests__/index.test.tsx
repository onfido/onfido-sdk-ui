import { h } from 'preact'
import { mount, ReactWrapper } from 'enzyme'

import MockedLocalised from '~jest/MockedLocalised'
import MockedReduxProvider from '~jest/MockedReduxProvider'
import { fakeCapturePayload } from '~jest/captures'
import DocumentOverlay, {
  Props as DocumentOverlayProps,
} from '../../Overlay/DocumentOverlay'
import FallbackButton, {
  Props as FallbackButtonProps,
} from '../../Button/FallbackButton'
import VideoCapture, { Props as VideoCaptureProps } from '../../VideoCapture'

import DocumentVideo, { Props as DocumentVideoProps } from '../index'

import type { DocumentTypes } from '~types/steps'

jest.mock('~utils')
navigator.vibrate = jest.fn()

const defaultProps: DocumentVideoProps = {
  cameraClassName: 'fakeCameraClass',
  documentType: 'driving_licence',
  onCapture: jest.fn(),
  renderFallback: jest.fn(),
  trackScreen: jest.fn(),
}

const waitForTimeout = (
  wrapper: ReactWrapper,
  type: 'button' | 'success' | 'recording'
) => {
  switch (type) {
    case 'button':
      jest.runTimersToTime(3000)
      break
    case 'success':
      jest.runTimersToTime(2000)
      break
    case 'recording':
      jest.runTimersToTime(30_000)
      break
    default:
      break
  }

  wrapper.update()
}

const simulateButtonClick = (
  wrapper: ReactWrapper,
  shouldWait = false,
  forceRerender = false
) => {
  if (shouldWait) {
    waitForTimeout(wrapper, 'button')
  }

  const button = wrapper.find('VideoLayer Button > button')
  button.simulate('click')

  waitForTimeout(wrapper, 'success')

  if (forceRerender) {
    // Force rerender to trigger useEffect in DocumentVideo
    // https://github.com/enzymejs/enzyme/issues/2091#issuecomment-486680844
    wrapper.setProps({})
  }
}

const assertOverlay = (
  wrapper: ReactWrapper,
  documentType: DocumentTypes,
  withPlaceholder: boolean
) => {
  const documentOverlay = wrapper.find<DocumentOverlayProps>(DocumentOverlay)
  expect(documentOverlay.exists()).toBeTruthy()
  expect(documentOverlay.props().type).toEqual(documentType)
  expect(documentOverlay.props().withPlaceholder).toEqual(withPlaceholder)
}

const assertRecordingButton = (wrapper: ReactWrapper, text: string) => {
  const recordingButton = wrapper.find('VideoLayer Button')
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

  renderFallback('fake_fallback_reason')
  expect(defaultProps.renderFallback).toHaveBeenCalledWith(
    'fake_fallback_reason'
  )
  trackScreen('fake_screen_tracking')
  expect(defaultProps.trackScreen).toHaveBeenCalledWith('fake_screen_tracking')

  assertRecordingButton(wrapper, 'doc_video_capture.button_record')

  const instructions = wrapper.find('VideoLayer Instructions')
  expect(instructions.exists()).toBeTruthy()

  if (forSingleSidedDocs) {
    expect(instructions.props()).toMatchObject({
      title: 'doc_video_capture.instructions.passport.intro_title',
    })
  } else {
    expect(instructions.props()).toMatchObject({
      title: 'doc_video_capture.instructions.card_ids.intro_title',
    })
  }
}

const assertFirstStep = (
  wrapper: ReactWrapper,
  forSingleSidedDocs: boolean
) => {
  waitForTimeout(wrapper, 'button')
  assertRecordingButton(wrapper, 'doc_video_capture.button_next')

  const instructions = wrapper.find('VideoLayer Instructions')
  expect(instructions.exists()).toBeTruthy()

  if (forSingleSidedDocs) {
    expect(instructions.props()).toMatchObject({
      title: 'doc_video_capture.instructions.passport.step_1_title',
    })
  } else {
    expect(instructions.props()).toMatchObject({
      title: 'doc_video_capture.instructions.card_ids.step_1_title',
    })
  }
}

const assertSecondStep = (
  wrapper: ReactWrapper,
  forSingleSidedDocs: boolean
) => {
  waitForTimeout(wrapper, 'button')
  assertRecordingButton(wrapper, 'doc_video_capture.button_stop')

  const instructions = wrapper.find('VideoLayer Instructions')
  expect(instructions.exists()).toBeTruthy()

  if (forSingleSidedDocs) {
    expect(instructions.props()).toMatchObject({
      title: 'doc_video_capture.instructions.passport.step_2_title',
    })
  } else {
    expect(instructions.props()).toMatchObject({
      title: 'doc_video_capture.instructions.card_ids.step_2_title',
      subtitle: 'doc_video_capture.instructions.card_ids.step_2_subtitle',
    })
  }
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
            <DocumentVideo {...defaultProps} />
          </MockedLocalised>
        </MockedReduxProvider>
      )
    })

    it('renders the video capture by default', () =>
      assertIntroStep(wrapper, false))

    it('renders overlay correctly', () =>
      assertOverlay(wrapper, 'driving_licence', true))

    describe('when recording', () => {
      beforeEach(() => simulateButtonClick(wrapper))

      it('sets correct timeout', () => {
        const timeout = wrapper.find('Timeout')
        expect(timeout.prop('seconds')).toEqual(30)
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
          wrapper.update()

          assertRecordingButton(wrapper, 'doc_video_capture.button_record')
        })
      })

      it('starts recording correctly', () => {
        assertOverlay(wrapper, 'driving_licence', false)
        assertFirstStep(wrapper, false)
      })

      it('moves to the second step correctly', () => {
        simulateButtonClick(wrapper, true, true)
        assertSecondStep(wrapper, false)
      })

      it('ends the flow with back side captured', () => {
        simulateButtonClick(wrapper, true, true) // 1st -> 2nd
        simulateButtonClick(wrapper, true, true) // 2nd -> complete

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
            <DocumentVideo {...defaultProps} documentType="passport" />
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
        assertFirstStep(wrapper, true)
      })

      it('ends the flow without capturing back side', () => {
        simulateButtonClick(wrapper, true, true)

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
})
