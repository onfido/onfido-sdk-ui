import '@testing-library/jest-dom'
import { render, Screen, screen } from '@testing-library/preact'
import userEvent from '@testing-library/user-event'
import { VideoOverlayProps } from 'components/VideoCapture'
import { h } from 'preact'
import { act } from 'preact/test-utils'
import MockedLocalised from '~jest/MockedLocalised'
import MockedVideoCapture from '~jest/MockedVideoCapture'
import { DocumentTypes } from '~types/steps'
import CaptureControls from '../CaptureControls'
import { MultiFrameCaptureStepActions } from '../useMultiFrameCaptureStep'

const mockNextStep = jest.fn()
const mockOnStart = jest.fn()

const assertControls = (
  screen: Screen,
  recordState: MultiFrameCaptureStepActions
) => {
  const button = screen.queryByLabelText(/video_capture.button_accessibility/)
  const progress = screen.queryByRole('progressbar')
  const success = screen.queryByLabelText(
    /doc_multi_frame_capture.success_accessibility/
  )

  switch (recordState) {
    case 'idle': {
      expect(button).toBeInTheDocument()
      expect(progress).not.toBeInTheDocument()
      expect(success).not.toBeInTheDocument()
      break
    }

    case 'scanning': {
      expect(button).not.toBeInTheDocument()
      expect(progress).toBeInTheDocument()
      expect(success).not.toBeInTheDocument()
      break
    }

    case 'success': {
      expect(button).not.toBeInTheDocument()
      expect(progress).not.toBeInTheDocument()
      expect(success).toBeInTheDocument()
      break
    }
  }
}

const renderCaptureControls = (recordState: MultiFrameCaptureStepActions) => {
  const defaultProps = {
    nextStep: mockNextStep,
    onStart: mockOnStart,
    documentType: 'passport' as DocumentTypes,
    recordState,
  }
  render(
    <MockedLocalised>
      <MockedVideoCapture
        renderVideoOverlay={(props: VideoOverlayProps) => {
          return <CaptureControls {...props} {...defaultProps} />
        }}
      />
    </MockedLocalised>
  )
}

describe('CaptureControls', () => {
  it('starts recording and goes to next step when clicking on capture', async () => {
    renderCaptureControls('idle')
    const button = screen.getByLabelText(/video_capture.button_accessibility/)
    await act(() => userEvent.click(button))
    expect(mockNextStep).toBeCalled()
    expect(mockOnStart).toBeCalled()
  })

  it('displays idle UI', () => {
    renderCaptureControls('idle')
    assertControls(screen, 'idle')
  })

  it('displays scanning UI', async () => {
    renderCaptureControls('scanning')
    assertControls(screen, 'scanning')
  })

  it('displays success UI', async () => {
    renderCaptureControls('success')
    assertControls(screen, 'success')
  })
})
