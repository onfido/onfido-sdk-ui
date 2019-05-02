import { h, Component } from 'preact'
import classNames from 'classnames'
import {sendScreen} from '../../Tracker'
import {wrapArray} from '../utils/array'
import NavigationBar from '../NavigationBar'
import theme from '../Theme/style.css'
import { withFullScreenState } from '../FullScreen'

class StepsRouter extends Component {
  componentDidUpdate(prevProps) {
    // Re-focus to content is needed for accessibility to have a correct
    // tabbing order, and should be triggered when...
    if (this.content &&
        // ...step changes (for tabbing order to start from the top)
        (prevProps.step !== this.props.step) ||
        // ..."full screen" mode changes (e.g. for enlarged image preview)
        (prevProps.isFullScreen !== this.props.isFullScreen)) {
      this.content.focus()
    }
  }

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
      <div
        ref={node => this.content = node}
        tabIndex={-1}
        className={classNames(theme.step, {
          [theme.fullScreenStep]: isFullScreen
        })}
      >
      <NavigationBar
        back={back}
        disabled={disableNavigation}
        className={theme.navigationBar}
      />
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
