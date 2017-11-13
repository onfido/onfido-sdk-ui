import { h, Component } from 'preact'
import style from './style.css'
import classNames from 'classnames'
import {preventDefaultOnClick} from '../utils'

class NavigationBar extends Component {
  constructor(props) {
    super(props)
    this.state = {hover: false}
  }

  setHoverState = (state) => {
    this.setState({hover: state})
  }

  render = ({back}) =>
    <div className={style.navigation}>
      <button href='#' className={classNames(style.back,{[style.backHover]: this.state.hover} )}
        onClick={preventDefaultOnClick(back)}
        onMouseEnter={() => this.setHoverState(true)}
        onMouseLeave={() => this.setHoverState(false)}>
          <span className={style.iconBack} />
          back
      </button>
   </div>
}

export default NavigationBar
