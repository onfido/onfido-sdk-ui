import { h } from 'preact'
import style from './style.css'
import classNames from 'classnames'
import {preventDefaultOnClick} from '../utils'

const NavigationBar = ({back}) =>
  <div className={style.navigation}>
    <button href='#' className={classNames(style.back)}
      onClick={preventDefaultOnClick(back)}>
        <span className={style.iconBack} />
        back
    </button>
 </div>

export default NavigationBar
