import { h, Component } from 'preact'
import Webcam from 'webcamjs'

import style from './style.css'

export default class WebcamVideo extends Component {

  constructor(props) {
    super(props)
    const { enable_flash } = this.props
    Webcam.set({enable_flash})
  }

  webcamDiv = null

  webcamRef = (element) => {
    this.webcamDiv = element ? element : null
  }

  snap = (callback) => {
    Webcam.snap(callback)
  }

  componentWillMount () {
    Webcam.on('live', this.props.onLive(Webcam))
    Webcam.on('error', this.props.onError)
    Webcam.on('error', this.props.onWebcamError)
  }

  componentDidMount () {
    Webcam.attach(this.webcamDiv)
  }

  componentWillUnmount () {
    Webcam.off('live')
    Webcam.reset()
  }

  shouldComponentUpdate(nextProps, nextState) {
    // We have dynamically updated the DOM so React will always try to update.
    // This component should never update as it just displays the camera
    return false
  }

  render = () =>
    <div ref={this.webcamRef} className={style.video}></div>
}
