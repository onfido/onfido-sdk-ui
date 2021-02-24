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

jest.mock('../../utils')

const defaultProps: DocumentVideoProps = {
  cameraClassName: 'fakeCameraClass',
  documentType: 'driving_licence',
  onCapture: jest.fn(),
  renderFallback: jest.fn(),
  trackScreen: jest.fn(),
}

const simulateCaptureClick = (
  wrapper: ReactWrapper,
  waitForSuccessTimedOut = true
) => {
  const button = wrapper.find('VideoLayer Button > button')
  button.simulate('click')

  if (waitForSuccessTimedOut) {
    jest.runTimersToTime(2000)
    wrapper.update()
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

  assertRecordingButton(wrapper, 'doc_video_capture.button_start')

  const instructions = wrapper.find('VideoLayer Instructions')
  expect(instructions.exists()).toBeTruthy()

  if (forSingleSidedDocs) {
    expect(instructions.props()).toMatchObject({
      title: 'doc_video_capture.instructions.passport.intro_title',
    })
  } else {
    expect(instructions.props()).toMatchObject({
      title: 'doc_video_capture.instructions.others.intro_title',
    })
  }
}

const assertFrontStep = (
  wrapper: ReactWrapper,
  forSingleSidedDocs: boolean
) => {
  assertRecordingButton(wrapper, 'doc_video_capture.button_record')

  const instructions = wrapper.find('VideoLayer Instructions')
  expect(instructions.exists()).toBeTruthy()

  if (forSingleSidedDocs) {
    expect(instructions.props()).toMatchObject({
      title: 'doc_video_capture.instructions.passport.front_title',
      subtitle: 'doc_video_capture.instructions.passport.front_subtitle',
    })
  } else {
    expect(instructions.props()).toMatchObject({
      title: 'doc_video_capture.instructions.others.front_title',
      subtitle: 'doc_video_capture.instructions.others.front_subtitle',
    })
  }
}

const assertTiltStep = (wrapper: ReactWrapper, forSingleSidedDocs: boolean) => {
  assertRecordingButton(wrapper, 'doc_video_capture.button_next')

  const instructions = wrapper.find('VideoLayer Instructions')
  expect(instructions.exists()).toBeTruthy()

  if (forSingleSidedDocs) {
    expect(instructions.props()).toMatchObject({
      icon: 'tilt',
      title: 'doc_video_capture.instructions.passport.tilt_title',
      subtitle: 'doc_video_capture.instructions.passport.tilt_subtitle',
    })
  } else {
    expect(instructions.props()).toMatchObject({
      icon: 'tilt',
      title: 'doc_video_capture.instructions.others.tilt_title',
      subtitle: 'doc_video_capture.instructions.others.tilt_subtitle',
    })
  }
}

const assertBackStep = (wrapper: ReactWrapper) => {
  assertRecordingButton(wrapper, 'doc_video_capture.button_stop')

  const instructions = wrapper.find('VideoLayer Instructions')
  expect(instructions.exists()).toBeTruthy()

  expect(instructions.props()).toMatchObject({
    icon: 'back',
    title: 'doc_video_capture.instructions.others.back_title',
    subtitle: 'doc_video_capture.instructions.others.back_subtitle',
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
      beforeEach(() => simulateCaptureClick(wrapper, false))

      it('sets correct timeout', () => {
        const timeout = wrapper.find('Timeout')
        expect(timeout.prop('seconds')).toEqual(30)
      })

      describe('when inactive timed out', () => {
        beforeEach(() => {
          jest.runTimersToTime(30_000)
          wrapper.update()
        })

        it('handles redo fallback correctly', () => {
          wrapper.find<FallbackButtonProps>(FallbackButton).props().onClick()
          wrapper.update()

          assertRecordingButton(wrapper, 'doc_video_capture.button_start')
        })
      })

      it('starts recording correctly', () => {
        assertOverlay(wrapper, 'driving_licence', false)
        assertFrontStep(wrapper, false)
      })

      it('moves to the tilt step correctly', () => {
        simulateCaptureClick(wrapper) // front -> tilt
        assertTiltStep(wrapper, false)
      })

      it('moves to the back step correctly', () => {
        simulateCaptureClick(wrapper) // front -> tilt
        simulateCaptureClick(wrapper) // tilt -> back
        assertBackStep(wrapper)
      })

      it('switches to the back document capture step', () => {
        simulateCaptureClick(wrapper) // front -> tilt
        simulateCaptureClick(wrapper) // tilt -> back
        simulateCaptureClick(wrapper) // back -> done

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

  describe('with single-sided documents', () => {
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
      beforeEach(() => simulateCaptureClick(wrapper, false))

      it('starts recording correctly', () => {
        assertOverlay(wrapper, 'passport', false)
        assertFrontStep(wrapper, true)
      })

      it('moves to the tilt step correctly', () => {
        simulateCaptureClick(wrapper) // front -> tilt
        assertTiltStep(wrapper, true)
      })

      it('ends the flow without capturing back side', () => {
        simulateCaptureClick(wrapper) // front -> tilt
        simulateCaptureClick(wrapper) // tilt -> done

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
