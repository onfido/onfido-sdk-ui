import { h } from 'preact'
import {preventDefaultOnClick} from '../../utils'
import style from './style.css'
import ChangeFlow from '../ChangeFlow'

const SwitchDevice = ({i18n = {}}) => (
  <ChangeFlow renderButton={ enter => (
    <a href='#' className={style.switchClickableArea} onClick={enter}>
      <div className={style.container}>
        <div className={style.icon} />
        <div className={style.copy}>
          <div className={style.header}>{i18n.t('cross_device.switch_device.header')}</div>
          <p className={style.submessage}>{i18n.t('cross_device.switch_device.submessage')}</p>
        </div>
        <div className={style.chevron} />
      </div>
    </a>
  )} />

)

export default SwitchDevice