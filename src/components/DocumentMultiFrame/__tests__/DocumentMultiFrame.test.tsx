import '@testing-library/jest-dom'

import { FunctionComponent, h } from 'preact'
import { render, screen } from '@testing-library/preact'

import DocumentMultiFrame, {
  DocumentMultiFrameProps,
} from '../DocumentMultiFrame'
import MockedReduxProvider from '~jest/MockedReduxProvider'
import MockedLocalised from '~jest/MockedLocalised'
import MockedContainerDimensions from '~jest/MockedContainerDimensions'

jest.mock('~utils')

const Wrapper: FunctionComponent = ({ children }) => {
  return (
    <MockedReduxProvider>
      <MockedLocalised>
        <MockedContainerDimensions>{children}</MockedContainerDimensions>
      </MockedLocalised>
    </MockedReduxProvider>
  )
}

const documentMultiFrameProps: DocumentMultiFrameProps = {
  cameraClassName: 'fakeCameraClass',
  documentType: 'passport',
  onCapture: jest.fn(),
  renderFallback: jest.fn(),
  trackScreen: jest.fn(),
}

describe('Multi Frame Support', () => {
  beforeEach(() => {
    render(
      <Wrapper>
        <DocumentMultiFrame {...documentMultiFrameProps} />
      </Wrapper>
    )
  })

  it('should display the overlay, instructions and a button', () => {
    const overlay = screen.getByText(/video_capture.frame_accessibility/)
    const instructions = screen.getByText(/instructions/i)
    const button = screen.getByLabelText(/video_capture.button_accessibility/)

    expect(overlay).toBeInTheDocument()
    expect(instructions).toBeInTheDocument()
    expect(button).toBeInTheDocument()
  })
})
