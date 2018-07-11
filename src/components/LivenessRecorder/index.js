// @flow
import * as React from 'react'
import { h, Component } from 'preact'
import theme from '../Theme/style.css'
import classNames from 'classnames'
import style from './style.css'
import {errors} from '../strings/errors'
import { trackComponent } from '../../Tracker'
import Title from '../Title'
import {preventDefaultOnClick} from 'components/utils'
import Intro from './Intro'
import Challenges from './Challenges'
import Review from './Review'

type Props = {
  onComplete: Blob => void,
  onRestart: void => void,
};

type State = {
  hasSeenIntro: boolean,
  hasRecordedVideo: boolean,
  video?: Blob,
};

class LivenessRecorder extends Component<Props, State> {
  state: State = {
    hasSeenIntro: false,
    hasRecordedVideo: false,
  }

  handleIntroNext = () => this.setState({ hasSeenIntro: true })

  handleVideoRecorded = video => this.setState({
    hasRecordedVideo: true,
    video,
  })

  handleRedo = () => this.setState({
    hasRecordedVideo: false,
    video: undefined,
  })

  handleConfirm = () => {
    this.props.onComplete(this.state.video)
  }

  render() {
    const { hasSeenIntro, hasRecordedVideo } = this.state
    const { challenges, onRestart } = this.props
    return (
      !hasSeenIntro ?
        <Intro {...{onNext: this.handleIntroNext, i18n}} /> :
        !hasRecordedVideo ?
          <Challenges { ...{ i18n, challenges,
            onVideoRecorded: this.handleVideoRecorded,
            onRestart,
          }}
          /> :
          <Review {...{
            onRedo: this.handleRedo,
            onConfirm: this.handleConfirm,
          }} />
    )
  }
}

export default trackComponent(LivenessRecorder)
