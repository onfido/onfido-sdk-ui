import { h, Component } from 'preact'

export default class Interval extends Component {

  state = {
    enabled: this.props.enabled,
    timeout: this.props.timeout,
    callback: this.props.callback
  }

  componentDidMount() {
    if (this.props.enabled) {
      this.start()
    }
  }

  componentWillReceiveProps({enabled}) {
    this.setState({enabled})
  }

  componentWillUnmount() {
    this.stop()
  }

  callback() {
    this.props.callback()
    this.start()
  }

  start() {
    this.stop()
    this.timer = setTimeout(this.callback, this.props.timeout)
  }

  stop() {
    clearTimeout(this.timer)
  }

  render() {
    console.log(this.props)
    if (this.state.enabled) {
      this.start()
    } else {
      this.stop()
    }
    return false
  }

}
