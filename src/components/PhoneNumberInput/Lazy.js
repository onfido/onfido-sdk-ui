import { h, Component } from 'preact'
import Spinner from '../Spinner'

class PhoneNumberInputLazy extends Component {
  constructor(props){
    super(props)
    this.state = {component: Spinner }

    import(/* webpackChunkName: "mobile-number-validations" */ './index.js').then(component => {
      this.setState({component})
    }).catch(() => 'An error occurred while loading the component');
  }

  render = (props)=> <this.state.component {...props}/>
}

export default PhoneNumberInputLazy
