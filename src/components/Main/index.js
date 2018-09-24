import { h, Component } from 'preact'
import classNames from 'classnames'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import FlowRoot from '../Flow/Root'
import theme from '../Theme/style.css'

import { unboundActions } from '../../core'
import { initializeI18n } from '../../locales'
import CaptureFlow from './CaptureFlow'

class Main extends Component {

  state = {
    isFullScreen: false,
  }

  useFullScreen = isFullScreen => this.setState({ isFullScreen })

  handleComplete = () => {
    const faceCapture = this.props.captures.face[0]
    const variant = faceCapture && faceCapture.variant
    const data = variant ? {face: {variant}} : {}
    this.props.options.events.emit('complete', data)
  }

  render() {
    const { options, ...props } = this.props
    const { isFullScreen } = this.state
    const moreProps = {
      allowCrossDeviceFlow: !options.mobileFlow,
      i18n: initializeI18n(options.language),
      useFullScreen: this.useFullScreen,
      trackScreen: () => {} /* @todo */
    }

    return (
      <FlowRoot name="steps">
        <div className={classNames(theme.step, {[theme.fullScreenStep]: isFullScreen  })}>
          <div className={classNames(theme.content, {
            [theme.fullScreenContentWrapper]: isFullScreen,
          })}>
            <CaptureFlow {...options} {...props} {...moreProps} />
          </div>
          <div className={theme.footer} />
        </div>
      </FlowRoot>
    )
  }
}

function mapStateToProps(state) {
  return {...state.globals, captures: state.captures}
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(unboundActions, dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)
