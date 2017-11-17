import { h, Component } from 'preact'
import {sendScreen} from '../../Tracker'
import {wrapArray} from '../utils/array'

class StepsRouter extends Component {
  constructor(props) {
    super(props)
  }

  trackScreen = (screenNameHierarchy, properties = {}) => {
    const { step } = this.currentComponent()
    sendScreen(
      [step.type, ...wrapArray(screenNameHierarchy)],
      {...properties, ...step.options})
  }

  currentComponent = () => this.props.componentsList[this.props.step]

  render = ({options: {...globalUserOptions}, ...otherProps}) => {
    const componentBlob = this.currentComponent()
    const CurrentComponent = componentBlob.component
    return (
      <CurrentComponent
        {...{...componentBlob.step.options, ...globalUserOptions, ...otherProps}}
        trackScreen = {this.trackScreen}
      />
    )
  }
}

export default StepsRouter
