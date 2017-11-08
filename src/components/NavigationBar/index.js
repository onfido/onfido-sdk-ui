import { h } from 'preact'
import style from './style.css'
import {preventDefaultOnClick} from '../utils'

const NavigationBar = ({back}) => {
  return (
    <div className={style.navigation}>
      <a href='#' className={style.back} onClick={preventDefaultOnClick(back)}>{`<back`}</a>
   </div>
  )
}

export default NavigationBar
