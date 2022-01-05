import '@testing-library/jest-dom'
import { render, Screen, screen } from '@testing-library/preact'
import userEvent from '@testing-library/user-event'
import { wait } from '@testing-library/user-event/dist/utils'
import { h } from 'preact'
import { act } from 'preact/test-utils'
import MockedLocalised from '~jest/MockedLocalised'
import MockedVideoCapture from '~jest/MockedVideoCapture'
import { DocumentSides } from '~types/commons'
import { DocumentTypes } from '~types/steps'
import CaptureControls from '../CaptureControls'

const assertControls = (
  screen: Screen,
  stage: 'idle' | 'scanning' | 'success'
) => {
  const button = screen.queryByLabelText(/video_capture.button_accessibility/)
  const instructions = screen.queryByText(/instructions/i)
  const progress = screen.queryByRole('progressbar')
  const success = screen.queryByLabelText(
    /doc_video_capture.success_accessibility/
  )

  switch (stage) {
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

const defaultProps = {
  documentType: 'passport' as DocumentTypes,
  onSubmit: jest.fn(),
  side: 'front' as DocumentSides,
}
describe('CaptureControls', () => {
  beforeEach(() => {
    render(
      <MockedLocalised>
        <MockedVideoCapture
          renderVideoOverlay={(props) => (
            <CaptureControls {...props} {...defaultProps} />
          )}
        />
      </MockedLocalised>
    )
  })

  it('should start idling', () => {
    assertControls(screen, 'idle')
  })

  it('should scan when clicking on camera button', async () => {
    const button = screen.getByLabelText(/video_capture.button_accessibility/)
    act(() => userEvent.click(button))
    assertControls(screen, 'scanning')
  })

  it('should display success after scannin 1.5 sec', async () => {
    const button = screen.getByLabelText(/video_capture.button_accessibility/)
    act(() => userEvent.click(button))
    await wait(2000)
    assertControls(screen, 'success')
  })
})
