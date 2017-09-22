import { h } from 'preact'
import {preventDefaultOnClick} from '../../utils'
import style from './style.css'

const SwitchDevice = ({startCrossDevice}) => {
  return (
    <div className={style.container}>
      <a href='#' onClick={preventDefaultOnClick(startCrossDevice)}>
        <div className={style.icon} />
        <div className={style.copy}>
          <div className={style.header}>Need to use your mobile to take photos?</div>
          <p className={style.submessage}>Safely continue verification on your mobile </p>
        </div>
        <div className={style.chevron} />
      </a>
    </div>
  )
}

export default SwitchDevice
