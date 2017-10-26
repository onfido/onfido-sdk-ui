import { h, Component } from 'preact'
import style from './style.css'

const Loading = () => <div className={style.loading}>Loading...</div>

class PhoneNumberInputLazy extends Component {
  constructor(props){
    super(props)
    this.state = {component: Loading }

    import(/* webpackChunkName: "mobile-number-validations" */ './index.js').then(component => {
      this.setState({component})
    }).catch(() => 'An error occurred while loading the component');
  }

  render = (props)=> <this.state.component {...props}/>
}

export default PhoneNumberInputLazy
