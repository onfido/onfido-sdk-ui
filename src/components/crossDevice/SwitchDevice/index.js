import { h } from 'preact'
import {preventDefaultOnClick} from '~utils/index'
import style from './style.css'
import { localised } from '../../../locales'

const SwitchDevice = ({translate, changeFlowTo}) =>
  <a href='#' className={style.switchClickableArea} onClick={preventDefaultOnClick(() => changeFlowTo('crossDeviceSteps'))}>
    <div className={style.container}>
        <div className={style.icon} />
        <div className={style.copy}>
          <div className={style.header}>{translate('cross_device.switch_device.header')}</div>
          <p className={style.submessage}>{translate('cross_device.switch_device.submessage')}</p>
        </div>
        <div className={style.chevron} />
    </div>
  </a>

export default localised(SwitchDevice)
