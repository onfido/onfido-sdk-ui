import '@testing-library/jest-dom'
import { render, Screen, screen } from '@testing-library/preact'
import userEvent from '@testing-library/user-event'
import { VideoOverlayProps } from 'components/VideoCapture'
import { h } from 'preact'
import { act } from 'preact/test-utils'
import MockedLocalised from '~jest/MockedLocalised'
import MockedVideoCapture from '~jest/MockedVideoCapture'
import { DocumentSides } from '~types/commons'
import { DocumentTypes } from '~types/steps'
import CaptureControls from '../CaptureControls'
import { MultiFrameCaptureStepActions } from '../useMultiFrameCaptureStep'

const mockNextStep = jest.fn()
const mockOnStart = jest.fn()

const assertControls = (
  screen: Screen,
  recordState: MultiFrameCaptureStepActions,
  side: DocumentSides = 'front'
) => {
  const button = screen.queryByLabelText(/video_capture.button_accessibility/)
  const instructions = screen.queryByText(
    side === 'front' ? /instructions front side/i : /instructions back side/i
  )
  const progress = screen.queryByRole('progressbar')
  const success = screen.queryByLabelText(
    /doc_video_capture.success_accessibility/
  )

  switch (recordState) {
    case 'idle': {
      expect(button).toBeInTheDocument()
      expect(instructions).toBeInTheDocument()
      expect(progress).not.toBeInTheDocument()
      expect(success).not.toBeInTheDocument()
      break
    }

    case 'scanning': {
      expect(button).not.toBeInTheDocument()
      expect(instructions).not.toBeInTheDocument()
      expect(progress).toBeInTheDocument()
      expect(success).not.toBeInTheDocument()
      break
    }

    case 'success': {
      expect(button).not.toBeInTheDocument()
      expect(instructions).not.toBeInTheDocument()
      expect(progress).not.toBeInTheDocument()
      expect(success).toBeInTheDocument()
      break
    }
  }
}

const renderCaptureContols = (
  recordState: MultiFrameCaptureStepActions,
  side: DocumentSides = 'front'
) => {
  const defaultProps = {
    nextStep: mockNextStep,
    onStart: mockOnStart,
    documentType: 'passport' as DocumentTypes,
    side,
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
    renderCaptureContols('idle')
    const button = screen.getByLabelText(/video_capture.button_accessibility/)
    act(() => userEvent.click(button))
    expect(mockNextStep).toBeCalled()
    expect(mockOnStart).toBeCalled()
  })

  it('displays idle UI', () => {
    renderCaptureContols('idle')
    assertControls(screen, 'idle')
  })
  it('displays idle UI back', () => {
    renderCaptureContols('idle', 'back')
    assertControls(screen, 'idle', 'back')
  })

  it('displays scanning UI', async () => {
    renderCaptureContols('scanning')
    assertControls(screen, 'scanning')
  })

  it('displays success UI', async () => {
    renderCaptureContols('success')
    assertControls(screen, 'success')
  })
})
