import { h, Component } from 'preact'
import { createComponentList } from './StepComponentMap'
import MobileLink from '../crossDevice/MobileLink'
import MobileFlowInProgress from '../crossDevice/MobileFlowInProgress'
import MobileFlowComplete from '../crossDevice/MobileFlowComplete'
import Flow from './Flow'

const crossDeviceComponents = {
  mobileLink: () => [MobileLink],
  mobileConnection: () => [MobileFlowInProgress, MobileFlowComplete]
}

const mobileSteps = [{'type': 'mobileLink'}, {'type': 'mobileConnection'}]

class CrossDeviceFlow extends Component {
  constructor(props) {
    super(props)
    this.state = {
      step: this.props.step,
      componentsList: createComponentList(crossDeviceComponents, mobileSteps),
      mobileUrl: this.props.mobileUrl
    }
  }

  render = ({...otherProps}) => {
    return (
      <div>
        <Flow {...otherProps}
          step={this.state.step}
          componentsList={this.state.componentsList}
          flow={this.state.flow}
        />
      </div>
    )
  }
}

export default CrossDeviceFlow
