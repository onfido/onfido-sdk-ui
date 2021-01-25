import { h, Component } from 'preact'

import { currentMilliseconds } from '~utils'
import { sendScreen } from '../../Tracker'
import { localised } from '../../locales'
import { FaceOverlay } from '../Overlay'
import withChallenges from './withChallenges'
import VideoCapture from '../VideoCapture'
import Challenge from './Challenge'
import Recording from '../VideoCapture/Recording'
import StartRecording from '../VideoCapture/StartRecording'

import type { ChallengePayload } from '~types/api'
import type {
  WithChallengesProps,
  WithLocalisedProps,
  WithTrackingProps,
} from '~types/hocs'
import type {
  ErrorProp,
  HandleCaptureProp,
  RenderFallbackProp,
  StepComponentFaceProps,
} from '~types/routers'

type FaceVideoProps = {
  cameraClassName: string
  inactiveError: ErrorProp
  // onSwitchChallenge: () => void
  onVideoCapture: HandleCaptureProp
  renderFallback: RenderFallbackProp
} & StepComponentFaceProps

type Props = FaceVideoProps &
  WithChallengesProps &
  WithLocalisedProps &
  WithTrackingProps

type State = {
  currentIndex: number
  startedAt?: number
  switchSeconds?: number
}

const initialState: State = {
  currentIndex: 0,
  startedAt: undefined,
  switchSeconds: undefined,
}

class FaceVideo extends Component<Props, State> {
  state = { ...initialState }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.challenges !== this.props.challenges) {
      this.setState({ ...initialState })
    }
  }

  onRecordingStart = () => {
    this.setState({ startedAt: currentMilliseconds() })
    sendScreen(['face_video_capture_step_1'])
  }

  onVideoCapture: HandleCaptureProp = (payload) => {
    const { switchSeconds } = this.state
    const { challenges, challengesId: id } = this.props
    const challengeData = { challenges, id, switchSeconds }
    this.props.onVideoCapture({ ...payload, challengeData })
  }

  handleNextChallenge = () => {
    const { startedAt, currentIndex } = this.state
    this.setState({ currentIndex: currentIndex + 1 })

    if (startedAt) {
      this.setState({ switchSeconds: currentMilliseconds() - startedAt })
      sendScreen(['face_video_capture_step_2'])
    }
  }

  render = () => {
    const {
      cameraClassName,
      challenges = [],
      inactiveError,
      renderFallback,
      trackScreen,
    } = this.props

    const { currentIndex } = this.state

    const currentChallenge =
      challenges[currentIndex] || ({} as ChallengePayload)
    const isLastChallenge = currentIndex === challenges.length - 1

    return (
      <VideoCapture
        cameraClassName={cameraClassName}
        inactiveError={inactiveError}
        onRecordingStart={this.onRecordingStart}
        onVideoCapture={this.onVideoCapture}
        renderFallback={renderFallback}
        renderOverlay={({ hasCameraError, isRecording }) => (
          <FaceOverlay isWithoutHole={hasCameraError || isRecording} />
        )}
        renderVideoLayer={({
          disableInteraction,
          isRecording,
          onStart,
          onStop,
        }) =>
          isRecording ? (
            <Recording
              hasMoreSteps={!isLastChallenge}
              disableInteraction={disableInteraction}
              onNext={this.handleNextChallenge}
              onStop={onStop}
            >
              <Challenge challenge={currentChallenge} />
            </Recording>
          ) : (
            <StartRecording
              disableInteraction={disableInteraction}
              onStart={onStart}
            />
          )
        }
        trackScreen={trackScreen}
      />
    )
  }
}

export default localised(withChallenges(FaceVideo))
