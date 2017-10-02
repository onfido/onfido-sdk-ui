import { h, Component } from 'preact'

import MobileConnected from './MobileConnected'
import MobileComplete from './MobileComplete'

class MobileFlow extends Component {


  render (props) {
    return (<MobileConnected previousStep={props.previousStep}/>)
  }
}

export default MobileFlow
