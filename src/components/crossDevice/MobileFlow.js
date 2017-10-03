import { h, Component } from 'preact'

import MobileConnected from './MobileConnected'
import MobileComplete from './MobileComplete'

class MobileFlow extends Component {
  constructor(props) {
    super(props)
    this.state = {
      mobileComplete: false
    }
    this.props.socket.on('complete', this.onMobileComplete)
  }

  componentDidMount() {
    this.props.socket.on('get config', this.props.sendConfig)
  }

  onMobileComplete = () => {
    this.setState({mobileComplete: true})
  }

  render = (props) =>
    this.state.mobileComplete ?
      <MobileComplete/> : <MobileConnected back={props.back}/>
}

export default MobileFlow
