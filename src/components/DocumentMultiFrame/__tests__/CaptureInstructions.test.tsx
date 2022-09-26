import '@testing-library/jest-dom'
import { render, Screen, screen } from '@testing-library/preact'
import { h } from 'preact'
import MockedLocalised from '~jest/MockedLocalised'
import { DocumentSides } from '~types/commons'
import { MultiFrameCaptureStepActions } from '../useMultiFrameCaptureStep'
import CaptureInstructions from '../CaptureInstructions'

const assertControls = (
  screen: Screen,
  recordState: MultiFrameCaptureStepActions,
  side: DocumentSides = 'front'
) => {
  const instructions = screen.queryByText(
    `doc_multi_frame_capture.instructions_title_${side}`
  )

  switch (recordState) {
    case 'placeholder':
    case 'idle': {
      expect(instructions).toBeInTheDocument()
      break
    }

    case 'scanning':
    case 'success': {
      expect(instructions).not.toBeInTheDocument()
      break
    }
  }
}

const renderCaptureInstructions = (
  recordState: MultiFrameCaptureStepActions,
  side: DocumentSides = 'front'
) =>
  render(
    <MockedLocalised>
      <CaptureInstructions side={side} recordState={recordState} />
    </MockedLocalised>
  )

describe('CaptureControls', () => {
  it('displays idle UI', () => {
    renderCaptureInstructions('idle')
    assertControls(screen, 'idle')
  })

  it('displays idle UI back', () => {
    renderCaptureInstructions('idle', 'back')
    assertControls(screen, 'idle', 'back')
  })
})
