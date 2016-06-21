import { h, Component } from 'preact'
import { route } from 'preact-router'
import classNames from 'classnames'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
  unboundActions,
  store,
  events,
  selectors,
  connect as ws
} from 'onfido-sdk-core'

import Welcome from './Welcome'
import Select from './Select'
import Capture from './Capture'
import Confirm from './Confirm'
import Complete from './Complete'

import styles from '../style/style.css'

class App extends Component {

  componentWillMount () {
    const { token } = this.props.options
    this.socket = ws(token)
  }

  render () {
    const { step, websocketErrorEncountered } = this.props
    const conditionalServerError = (
      <div
        className={'server-error' + (websocketErrorEncountered ? '' : ' hidden')}
      >
        <div>
          <p>There was an error connecting to the server</p>
          <p>Please wait and try again later</p>
        </div>
      </div>
    )
    const defaults = {
      prevLink: `/step/${(parseInt(step, 10) - 1 || 1)}/`,
      nextLink: `/step/${(parseInt(step, 10) + 1 || 1)}/`,
      ...this.props
    }
    const steps = [
      // :step/0
      <Welcome {...defaults} />,
      // :step/1
      <Select method='document' {...defaults} />,
      // :step/2
      <Capture method='document' {...defaults} autoCapture={true} socket={this.socket} />,
      // :step/3
      <Capture method='face' {...defaults} autoCapture={false} socket={this.socket} />,
      // :step/4
      <Complete {...defaults} />,
    ]
    const [ first ] = steps
    return (
      <div>
        {conditionalServerError}
        {step && steps[step] || first}
      </div>
    )
  }

}

const {
  documentCaptured,
  faceCaptured,
  documentSelector,
  faceSelector
} = selectors

function mapStateToProps(state) {
  return {
    documentCaptures: documentSelector(state),
    faceCaptures: faceSelector(state),
    documentCaptured: documentCaptured(state),
    faceCaptured: faceCaptured(state),
    ...state.globals
  }
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(unboundActions, dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
