// @flow
import * as React from 'react'
import { h, Component } from 'preact'
import { FrontDocumentCapture } from '../Capture'
import Guidance from './Guidance'
import { trackComponent } from '../../Tracker'
export { default as PoAIntro } from './PoAIntro'

type Props = {
  documentType: string,
  trackScreen: Function,
}

type State = {
  hasSeenGuidanceScreen: boolean,
}

class PoACapture extends Component<Props, State> {
  state = {
    hasSeenGuidanceScreen: false,
  }

  handleIntroNext = () => {
    this.setState({ hasSeenGuidanceScreen: true })
  }

  render() {
    const { documentType, trackScreen } = this.props
    return this.state.hasSeenGuidanceScreen ?
      <FrontDocumentCapture {...this.props} /> :
      <Guidance {...{trackScreen, documentType, nextStep: this.handleIntroNext}} />
  }
}

export default trackComponent(PoACapture)