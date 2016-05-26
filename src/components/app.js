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
import Capture from './Capture'
import screenWidth from './utils/screenWidth'

import styles from '../style/style.css'

class App extends Component {

  state = {
    cameraActive: false,
    method: 'home'
  }

  changeView = (cameraActive = false, method = 'home') => {
    // console.log('changeView')
    this.setState({ cameraActive, method })
    events.emit('initCamera')
  }

  componentWillMount () {
    const { options } = this.props
    const { token } = options
    this.socket = ws(token)
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
          changeView={this.changeView}
          {...this.state}
          {...this.props}
        />
        <Capture
          socket={this.socket}
          changeView={this.changeView}
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
