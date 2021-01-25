import { h, Component, ComponentType } from 'preact'
import Spinner from '../Spinner'
import CameraError from '../CameraError'
import { requestChallenges } from '~utils/onfidoApi'
import { currentMilliseconds } from '~utils'
import { sendScreen } from '../../Tracker'

import type { ApiRequest, ApiResponse, ChallengePayload } from '~types/api'
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
  hasError: boolean
  hasLoaded: boolean
  challengeRequestedAt: number
}

const initialState: State = {
  challengesId: '',
  challenges: [],
  hasLoaded: false,
  hasError: false,
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
          const url = this.props.urls.onfido_api_url
          requestChallenges(
            url,
            this.props.token,
            this.handleResponse,
            this.handleError
          )
          sendScreen(['face_video_challenge_requested'])
        }
      )
    }

    handleResponse = (response: ApiResponse) => {
      const challenges = response.data?.challenge
      const challengesId = String(response.data?.id)

      this.setState({ challenges, challengesId, hasLoaded: true })

      sendScreen(['face_video_challenge_loaded'], {
        challenge_loading_time: this.challengeLoadingTime(),
      })
    }

    handleError = (error: ApiRequest) => {
      this.setState({ hasLoaded: true, hasError: true })
      this.props.triggerOnError(error)
      sendScreen(['face_video_challenge_load_failed'], {
        challenge_loading_time: this.challengeLoadingTime(),
      })
    }

    challengeLoadingTime = () =>
      currentMilliseconds() - this.state.challengeRequestedAt

    renderError = () => {
      const { trackScreen, renderFallback } = this.props

      return (
        <CameraError
          {...{ trackScreen, renderFallback }}
          error={requestError}
          hasBackdrop
        />
      )
    }

    render() {
      const { hasLoaded, hasError, challenges, challengesId } = this.state

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
          renderError={hasError && this.renderError()}
        />
      )
    }
  }

export default withChallenges
