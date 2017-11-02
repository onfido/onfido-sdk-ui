import { h } from 'preact'
import style from './style.css'
import {preventDefaultOnClick} from '../utils'

const NavigationBar = ({previousStep}) => {
  return (
    <div className={style.navigation}>
      <div className={style.back} onClick={preventDefaultOnClick(previousStep)}>back</div>
   </div>
  )
}

export default NavigationBar
