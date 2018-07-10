import { h, Component } from 'preact'
import theme from '../Theme/style.css'
import classNames from 'classnames'
import style from './style.css'
import {errors} from '../strings/errors'
import { trackComponent } from '../../Tracker'
import Title from '../Title'
import {preventDefaultOnClick} from 'components/utils'

const challengeTypes = {
  'repeatDigits': RepeatDigits,
  'moveHead': MoveHead,
}

const RepeatDigits = ({ value: digits, i18n }) =>
  <div className={style.challenge}>
    <div className={style.instructions}>
      {i18n.t('capture.liveness.challenges.repeat_digits') }
     </div>
    <div className={style.challengeDigits}>
      {digits.join('–')}
    </div>
  </div>

const MoveHead = ({ value: side, i18n }) =>
  <div className={style.challenge}>
    <div className={style.instructions}>
      {i18n.t('capture.liveness.challenges.move_head', {
        side: i18n.t(`capture.liveness.challenges.${ side }`),
      })}
    </div>
    <span className={ classNames(style.moveHeadIcon, style[`moveHeadIcon-${ side }`])} />
  </div>

class ChallengeRecorder extends Component {
  state = {
    isRecording: false,
    currentIndex: 0,
  }

  componentWillUnmount() {
    clearTimeout(this.timeout)
  }

  handleNextChallenge = () => {
    this.setState({ currentIndex: this.state.currentIndex + 1 })
  }

  handleVideoRecordingStart = () => {
    const { onTimeout, timeoutDuration } = this.props
    this.setState({ isRecording: true })
    this.timeout = setTimeout(this.handleTimeout, timeoutDuration)
  }

  handleTimeout = () => {
    this.setState({ hasTimedOut: true })
  }

  render() {
    const { challenges = [], i18n, onRestart } = this.props
    const { isRecording, currentIndex, hasTimedOut } = this.state
    const { type, value } = challenges[currentIndex]
    const Challenge = challengeTypes[type]
    const isLastChallenge = currentIndex - 1 == challenges.length

    return (
      <div className={style.challengeRecorder}>
        {
          !isRecording ?
            <div className={style.instructions}>
              Position your face in the oval
            </div> :
            <div>
              <div className={style.recording} />
              <Challenge {...{value, i18n}} />
            </div>
        }
        {
          hasTimedOut ?
            <Error {...{i18n,
              renderAction: () =>
                <button
                  onClick={preventDefaultOnClick(onRestart)}
                  className={classNames(theme.btn, them['btn-ghost'])}
                />,
              error: {
                type: 'warning',
                name: 'LIVENESS_TIMEOUT',
              }}
            } /> :
            null
        }
        <Video
          i18n={i18n}
          onVideoRecordingStart={props.handleVideoRecordingStart}
          onVideoRecorded={props.onVideoRecorded}
        />
        {
          !isLastChallenge ?
            <button
              className={`${theme.btn} ${theme["btn-centered"]} ${theme["btn-primary"]}`}
              onClick={this.handleNextChallenge}>
              {i18n.t('webcam_permissions.enable_webcam')}
            </button> :
            null
        }
      </div>
    )
  }
}

export default trackComponent(ChallengeRecorder)
