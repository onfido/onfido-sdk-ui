import { h, Component } from 'preact'

import {sendScreen} from '../../Tracker'
import {wrapArray} from '../utils/array'
import {themeWrap} from '../Theme'

class StepsRouter extends Component {
  constructor(props) {
    super(props)
    this.state = {fullScreen: false}
  }

  trackScreen = (screenNameHierarchy, properties = {}) => {
    const { step } = this.currentComponent()
    sendScreen(
      [step.type, ...wrapArray(screenNameHierarchy)],
      {...properties, ...step.options})
  }

  currentComponent = () => this.props.componentsList[this.props.step]

  useFullScreen = (value) => this.setState({fullScreen: value})

  render = ({options: {...globalUserOptions}, ...otherProps}) => {
    const componentBlob = this.currentComponent()
    const CurrentComponent = componentBlob.component
    const WrappedApp = themeWrap(CurrentComponent)
    const options = componentBlob.step.options
    const isFullScreen = this.state.fullScreen

    return (
      <WrappedApp {...{...options, ...globalUserOptions, ...otherProps, isFullScreen}}
        trackScreen={this.trackScreen} useFullScreen={this.useFullScreen} />
    )
  }
}

export default StepsRouter
