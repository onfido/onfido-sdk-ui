import { h } from 'preact'
import {preventDefaultOnClick} from '../../utils'
import style from './style.css'
import { localised } from '../../../locales'

const SwitchDevice = ({t, changeFlowTo}) =>
  <a href='#' className={style.switchClickableArea} onClick={preventDefaultOnClick(() => changeFlowTo('crossDeviceSteps'))}>
    <div className={style.container}>
        <div className={style.icon} />
        <div className={style.copy}>
          <div className={style.header}>{t('cross_device.switch_device.header')}</div>
          <p className={style.submessage}>{t('cross_device.switch_device.submessage')}</p>
        </div>
        <div className={style.chevron} />
    </div>
  </a>

export default localised(SwitchDevice)
