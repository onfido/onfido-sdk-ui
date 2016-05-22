import { h, Component } from 'preact'
import classNames from 'classnames'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
  unboundActions,
  store,
  events,
  connect as ws
} from 'onfido-sdk-core'

import Home from './Home'
import HomeDocument from './HomeDocument'
import Camera from './Camera'
import screenWidth from './utils/screenWidth'

import styles from '../style/style.css'

class App extends Component {

  state = {
    cameraActive: false,
    method: 'home'
  }

  transition (cameraActive = false, method = 'home') {
    this.setState({ cameraActive, method })
    events.emit('initCamera')
  }

  componentWillMount () {
    const { options } = this.props
    const { token } = options
    this.socket = ws(token)
  }

  componentDidMount () {
    const { supportsGetUserMedia } = this.props
    const useCapture = (supportsGetUserMedia && (screenWidth > 800))

  }

  render() {
    const { cameraActive } = this.state
    const classes = classNames({
      'onfido-verify': true,
      'onfido-camera-active': cameraActive
    })
    return (
      <div id="app" className={classes}>
        <Home
          transition={::this.transition}
          {...this.state}
          {...this.props}
        />
        <HomeDocument />
        <Camera
          socket={this.socket}
          transition={::this.transition}
          {...this.state}
          {...this.props}
        />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    documentCaptures: state.documentCaptures,
    faceCaptures: state.faceCaptures,
    ...state.globals
  }
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(unboundActions, dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
