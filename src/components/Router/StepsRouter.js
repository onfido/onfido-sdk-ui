import { h, Component } from 'preact'

import {sendScreen} from '../../Tracker'
import {wrapArray} from '../utils/array'
import NavigationBar from '../NavigationBar'
import Footer from '../Footer'
import theme from '../Theme/style.css'

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
    const {back, i18n, disableBackNavigation} = this.props
    const options = componentBlob.step.options
    const isFullScreen = CurrentComponent.isFullScreen && options && options.liveCapture

    return (
      <div className={theme.step}>
        <NavigationBar {...{back, i18n, isFullScreen}} disabled={disableBackNavigation}/>
        <div className={theme.content}>
          <CurrentComponent
            {...{...options, ...globalUserOptions, ...otherProps, isFullScreen}}
            trackScreen = {this.trackScreen} />
        </div>
        <Footer />
      </div>
    )
  }
}

export default StepsRouter
