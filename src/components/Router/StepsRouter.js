import { h, Component } from 'preact'
import {sendScreen} from '../../Tracker'
import {wrapArray} from '../utils/array'
import NavigationBar from '../NavigationBar'

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
    const i18n = this.props.i18n
    return (
      <div>
        {!this.props.disableBackNavigation && <NavigationBar back={this.props.back} {...{i18n}} />}
        <CurrentComponent
          {...{...componentBlob.step.options, ...globalUserOptions, ...otherProps}}
          trackScreen = {this.trackScreen}
        />
      </div>
    )
  }
}

export default StepsRouter
