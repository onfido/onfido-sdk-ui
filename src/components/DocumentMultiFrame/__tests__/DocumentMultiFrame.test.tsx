import '@testing-library/jest-dom'
import { act, render, screen, waitFor } from '@testing-library/preact'
import userEvent from '@testing-library/user-event'
import { FunctionComponent, h } from 'preact'
import { trackException } from 'Tracker'
import { fakeCapturePayload } from '~jest/captures'
import MockedContainerDimensions from '~jest/MockedContainerDimensions'
import MockedLocalised from '~jest/MockedLocalised'
import MockedReduxProvider from '~jest/MockedReduxProvider'
import { DOC_MULTIFRAME_CAPTURE } from '~utils/constants'
import DocumentMultiFrame, {
  DocumentMultiFrameProps,
} from '../DocumentMultiFrame'

jest.mock('~utils')
// only mock trackException, see https://jestjs.io/docs/jest-object#jestrequireactualmodulename
jest.mock('Tracker', () => {
  const originalModule = jest.requireActual('Tracker')

  return {
    __esModule: true,
    ...originalModule,
    trackException: jest.fn(),
  }
})

const onCapture = jest.fn()
const trackScreen = jest.fn()
const mockedTrackException = trackException as jest.MockedFunction<
  typeof trackException
>

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
  side: 'front',
  onCapture,
  renderFallback: jest.fn(),
  trackScreen: trackScreen,
}

describe('Multi Frame Support', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.clearAllTimers()
  })

  beforeEach(() => {
    render(
      <Wrapper>
        <DocumentMultiFrame {...documentMultiFrameProps} />
      </Wrapper>
    )
  })

  it('displays the overlay, instructions and a button', () => {
    const overlay = screen.getByText(/video_capture.frame_accessibility/)
    const instructions = screen.getByText(
      /doc_multi_frame_capture.instructions_title_front/
    )
    const button = screen.getByLabelText(/video_capture.button_accessibility/)

    expect(overlay).toBeInTheDocument()
    expect(instructions).toBeInTheDocument()
    expect(button).toBeInTheDocument()
  })

  it('hides layout placehold when capture starts', () => {
    const button = screen.getByLabelText(/video_capture.button_accessibility/)
    act(() => userEvent.click(button))
  })

  it('records a video and take a picture when capture is success', () => {
    act(() => {
      jest.advanceTimersByTime(DOC_MULTIFRAME_CAPTURE.PLACEHOLDER_TIMEOUT)
    })

    const capture = screen.getByLabelText(/video_capture.button_accessibility/)

    act(() => {
      userEvent.click(capture)
    })

    act(() => {
      jest.advanceTimersByTime(DOC_MULTIFRAME_CAPTURE.SCANNING_TIMEOUT)
    })

    act(() => {
      jest.advanceTimersByTime(DOC_MULTIFRAME_CAPTURE.SUCCESS_STATE_TIMEOUT)
    })

    expect(mockedTrackException).not.toBeCalled()

    expect(onCapture).toHaveBeenNthCalledWith(1, {
      photo: {
        ...fakeCapturePayload('standard'),
        filename: 'document_front.jpeg',
      },
      video: {
        ...fakeCapturePayload('video'),
        filename: 'document_front.webm',
      },
    })
  })

  it('should call trackScreen on mount.', async () => {
    await waitFor(() => expect(trackScreen).toHaveBeenCalledTimes(1))
  })
})
