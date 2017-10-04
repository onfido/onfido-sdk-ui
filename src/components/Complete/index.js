import { h, Component } from 'preact'
import MobileSuccessfulUploads from '../crossDevice/MobileSuccessfulUploads'
import VerificationComplete from './VerificationComplete.js'

class Complete extends Component {
  render () {
    return (
      this.props.mobileFlow ?
      <MobileSuccessfulUploads {...{...this.props}}/> :
      <VerificationComplete {...{...this.props}} />
    )
  }
}

export default Complete
