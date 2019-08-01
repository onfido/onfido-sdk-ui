import { h, Component } from 'preact'
import classNames from 'classnames'
import {sendScreen} from '../../Tracker'
import {wrapArray} from '~utils/array'
import NavigationBar from '../NavigationBar'
import theme from '../Theme/style.css'
import { withFullScreenState } from '../FullScreen'

class StepsRouter extends Component {
  trackScreen = (screenNameHierarchy, properties = {}) => {
    const { step } = this.currentComponent()
    sendScreen(
      [step.type, ...wrapArray(screenNameHierarchy)],
      {...properties, ...step.options})
  }

  currentComponent = () => this.props.componentsList[this.props.step]

  render = () => {
    const { back, disableNavigation, isFullScreen, options: {...globalUserOptions}, ...otherProps} = this.props
    const componentBlob = this.currentComponent()
    const CurrentComponent = componentBlob.component
    const options = componentBlob.step.options
    return (
      //TODO: Wrap CurrentComponent in themeWrap HOC
      <div className={classNames(theme.step, { [theme.fullScreenStep]: isFullScreen })}>
        <NavigationBar
          back={back}
          disabled={disableNavigation}
          className={theme.navigationBar} />
        <div
          className={classNames(theme.content, {
            [theme.fullScreenContentWrapper]: isFullScreen,
            [theme.scrollableContent]: !isFullScreen
          })}
        >
          <CurrentComponent {...{...options, ...globalUserOptions, ...otherProps, back}}
            trackScreen={this.trackScreen} />
        </div>
        <div className={theme.footer} />
      </div>
    )
  }
}

export default withFullScreenState(StepsRouter)
