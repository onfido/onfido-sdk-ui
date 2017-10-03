import { h, Component } from 'preact'

let Empty = () => <div>Not here</div>

class PhoneNumberInputLazy extends Component {
  constructor(props){
    super(props)
    this.state = {component: Empty }

    import(/* webpackChunkName: "cross-device" */ './index.js').then(component => {
      this.setState({component})
    }).catch(() => 'An error occurred while loading the component');
  }

  render = (props)=> <this.state.component {...props}/>
}

export default PhoneNumberInputLazy
