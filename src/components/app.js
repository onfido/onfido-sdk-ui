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
import Welcome from './Welcome'
import screenWidth from './utils/screenWidth'

import { Slider, Slides, PrevArrow, NextArrow, Dots } from 'react-flex-slick'

import styles from '../style/style.css'

const getPosition = (width) => width * 100

class App extends Component {

  state = {
    cameraActive: false,
    method: 'home'
  }

  changeView = (cameraActive = false, method = 'home') => {
    console.log('changeView', cameraActive, method)
    this.setState({ cameraActive, method })
    events.emit('initCamera')
  }

  componentWillMount () {
    const { options } = this.props
    const { token } = options
    this.socket = ws(token)
  }

  render () {
    const views = [
      <Welcome
        changeView={() => this.changeView(false, 'home')}
        {...this.state}
        {...this.props}
      />,
      <Home
        changeView={this.changeView}
        {...this.state}
        {...this.props}
      />,
      <Capture
        socket={this.socket}
        changeView={this.changeView}
        {...this.state}
        {...this.props}
      />
    ]

    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    }

    const outerStyle = {
      width: `${100 * views.length}%`
    }
    const innerStyles = {
      width: `${100 / views.length}%`
    }

    const { cameraActive } = this.state
    const classes = classNames({
      'onfido-verify': true,
      'onfido-camera-active': cameraActive
    })

    const slideStyle = {
      width: 540,
      height: 125,
      backgroundColor: 'slateblue',
      color: 'white',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }

    return (
      <div id="app" className={classes}>
        <Slider>
          <PrevArrow
            activeClassName="non-infinite-left--active"
            inactiveClassName="non-infinite-left--inactive"
          />
          <Slides>
            <div style={slideStyle}><h1>1</h1></div>
            <div style={slideStyle}><h1>2</h1></div>
            <div style={slideStyle}><h1>3</h1></div>
            <div style={slideStyle}><h1>4</h1></div>
            <div style={slideStyle}><h1>5</h1></div>
            <div style={slideStyle}><h1>6</h1></div>
          </Slides>
          <NextArrow
            activeClassName="non-infinite-right--active"
            inactiveClassName="non-infinite-right--inactive"
          />
          <Dots />
        </Slider>
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
