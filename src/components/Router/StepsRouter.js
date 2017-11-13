import { h, Component } from 'preact'
import {sendScreen} from '../../Tracker'
import {wrapArray} from '../utils/array'
<<<<<<< HEAD
=======
import theme from '../Theme/style.css'
import NavigationBar from '../NavigationBar'
>>>>>>> d38b967... Styled icon hover and make style consistent across sdk

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
<<<<<<< HEAD
      <CurrentComponent
        {...{...componentBlob.step.options, ...globalUserOptions, ...otherProps}}
        trackScreen = {this.trackScreen}
      />
=======
      <div className={theme.step}>
        {!this.props.disableBackNavigation && <NavigationBar back={this.props.back} />}
        <CurrentComponent
          {...{...componentBlob.step.options, ...globalUserOptions, ...otherProps}}
          trackScreen = {this.trackScreen}
        />
      </div>
>>>>>>> d38b967... Styled icon hover and make style consistent across sdk
    )
  }
}

export default StepsRouter
