import { h, Component } from 'preact'

import {sendScreen} from '../../Tracker'
import {wrapArray} from '../utils/array'
import NavigationBar from '../NavigationBar'
import theme from '../Theme/style.css'

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
    const {back, i18n, disableBackNavigation} = this.props
    const options = componentBlob.step.options
    const isFullScreen = this.state.fullScreen

    return (
      <div className={theme.step}>
        <NavigationBar {...{back, i18n, isFullScreen}} disabled={disableBackNavigation} className={theme.navigationBar}
        />
        <div className={theme.content}>
          <CurrentComponent
            {...{...options, ...globalUserOptions, ...otherProps, isFullScreen}}
            trackScreen={this.trackScreen} useFullScreen={this.useFullScreen} />
        </div>
        <div className={theme.footer} />
      </div>
    )
  }
}

export default StepsRouter
