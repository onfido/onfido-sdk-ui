import { h, Component } from 'preact'

import MobileSuccess from '../crossDevice/MobileSuccess'
import VerificationComplete from './VerificationComplete.js'

class Complete extends Component {
  render (props) {
    return (
      this.props.mobileFlow ?
        <MobileSuccess {...props}/> :
        <VerificationComplete {...props} />
    )
  }
}

export default Complete
