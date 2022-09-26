import { h, Component, ComponentType } from 'preact'
import Spinner from '../Spinner'
import CameraError from '../CameraError'
import { requestChallenges } from '~utils/onfidoApi'
import { currentMilliseconds } from '~utils'
import { sendScreen } from '../../Tracker'

import type {
  ChallengePayload,
  VideoChallengeResponse,
  SuccessCallback,
  ErrorCallback,
} from '~types/api'
import type { WithChallengesProps } from '~types/hocs'
import type {
  ErrorProp,
  RenderFallbackProp,
  StepComponentFaceProps,
} from '~types/routers'

const requestError: ErrorProp = { name: 'REQUEST_ERROR', type: 'error' }

type Props = {
  renderFallback: RenderFallbackProp
} & StepComponentFaceProps

type State = {
  challengesId: string
  challenges: ChallengePayload[]
  error?: ErrorProp
  hasLoaded: boolean
  challengeRequestedAt: number
}

const initialState: State = {
  challengesId: '',
  challenges: [],
  hasLoaded: false,
  error: undefined,
  challengeRequestedAt: 0,
}

const withChallenges = <P extends Props>(
  WrappedVideo: ComponentType<P & WithChallengesProps>
): ComponentType<P> =>
  class WithChallenges extends Component<P, State> {
    state = { ...initialState }

    componentDidMount() {
      this.loadChallenges()
    }

    loadChallenges = () => {
      this.setState(
        { ...initialState, challengeRequestedAt: currentMilliseconds() },
        () => {
          const {
            token,
            urls: { onfido_api_url: url },
          } = this.props
          requestChallenges(url, token, this.handleResponse, this.handleError)
          sendScreen(['face_video_challenge_requested'])
        }
      )
    }

    handleResponse: SuccessCallback<VideoChallengeResponse> = (response) => {
      const challenges = response.data?.challenge
      const challengesId = String(response.data?.id)

      this.setState({ challenges, challengesId, hasLoaded: true })

      sendScreen(['face_video_challenge_loaded'], {
        challenge_loading_time: this.challengeLoadingTime(),
      })
    }

    handleError: ErrorCallback = (error) => {
      this.setState({
        hasLoaded: true,
        error: {
          ...requestError,
          properties: {
            error_message: error?.response?.message,
          },
        },
      })
      this.props.triggerOnError(error)
      sendScreen(['face_video_challenge_load_failed'], {
        challenge_loading_time: this.challengeLoadingTime(),
      })
    }

    challengeLoadingTime = () =>
      currentMilliseconds() - this.state.challengeRequestedAt

    render() {
      const { trackScreen, renderFallback } = this.props
      const { hasLoaded, error, challenges, challengesId } = this.state

      if (!hasLoaded) {
        return <Spinner />
      }

      const passedProps = {
        ...this.props,
        challengesId,
        challenges,
      }

      return (
        <WrappedVideo
          {...passedProps}
          onRedo={this.loadChallenges}
          renderError={
            error ? (
              <CameraError
                {...{ error, trackScreen, renderFallback }}
                hasBackdrop
              />
            ) : null
          }
        />
      )
    }
  }

export default withChallenges
