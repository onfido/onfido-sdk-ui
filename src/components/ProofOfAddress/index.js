import { h, Component } from 'preact'
import { FrontDocumentCapture } from '../Capture'
import Guidance from './Guidance'
import { trackComponent } from 'Tracker'
export { default as PoAIntro } from './PoAIntro'

type Props = {
  documentType: string,
  i18n: Object,
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
    const { i18n, documentType, trackScreen } = this.props
    return this.state.hasSeenGuidanceScreen ?
      <FrontDocumentCapture {...this.props} /> :
      <Guidance {...{i18n, trackScreen, documentType, nextStep: this.handleIntroNext}} />
  }
}

export default trackComponent(PoACapture)