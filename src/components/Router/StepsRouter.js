import { h, Component } from 'preact'
import classNames from 'classnames'

import {sendScreen} from '../../Tracker'
import {wrapArray} from '../utils/array'
import NavigationBar from '../NavigationBar'
import theme from '../Theme/style.css'

class StepsRouter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isFullScreen: false,
      isLiveness: false,
    }
  }

  trackScreen = (screenNameHierarchy, properties = {}) => {
    const { step } = this.currentComponent()
    sendScreen(
      [step.type, ...wrapArray(screenNameHierarchy)],
      {...properties, ...step.options})
  }

  currentComponent = () => this.props.componentsList[this.props.step]

  useFullScreen = (value, isLiveness = false) => this.setState({
    isFullScreen: value,
    isLiveness,
  })

  render = ({options: {...globalUserOptions}, ...otherProps}) => {
    const componentBlob = this.currentComponent()
    const CurrentComponent = componentBlob.component
    const {back, i18n, disableNavigation} = this.props
    const options = componentBlob.step.options
    const {isFullScreen, isLiveness} = this.state

    return (
      //TODO: Wrap CurrentComponent in themeWrap HOC
      <div className={theme.step}>
        <NavigationBar {...{back, i18n, isFullScreen, isLiveness}} disabled={disableNavigation} className={theme.navigationBar}/>
        <div className={classNames(theme.content,{
          [theme.fullScreenContentWrapper]: isFullScreen,
          [theme.livenessWrapper]: isLiveness,
        })}>
          <CurrentComponent {...{...options, ...globalUserOptions, ...otherProps, isFullScreen}}
            trackScreen={this.trackScreen} useFullScreen={this.useFullScreen} />
        </div>
        <div className={theme.footer} />
      </div>
    )
  }
}

export default StepsRouter
