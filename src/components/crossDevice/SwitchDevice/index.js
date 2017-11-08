import { h } from 'preact'
import {preventDefaultOnClick} from '../../utils'
import style from './style.css'

const SwitchDevice = ({changeFlowTo}) => {
  return (
    <a href='#' onClick={preventDefaultOnClick(() => changeFlowTo('crossDeviceSteps'))}>
      <div className={style.container}>
          <div className={style.icon} />
          <div className={style.copy}>
            <div className={style.header}>Need to use your mobile to take photos?</div>
            <p className={style.submessage}>Securely continue verification on your mobile</p>
          </div>
          <div className={style.chevron} />
      </div>
    </a>
  )
}

export default SwitchDevice
