import { h } from 'preact'

import theme from '../../Theme/style.css'
import style from './style.css'
import Title from '../../Title'
import { trackComponent } from '../../../Tracker'
import {preventDefaultOnClick} from '../../utils'

const MobileConnected = ({i18n, back}) => {
  return (
    <div>
      <Title
        title={i18n.t('cross_device.mobile_connected.title.message')}
        subTitle={i18n.t('cross_device.mobile_connected.title.submessage')}
      />
      <div className={theme.thickWrapper}>
        <span className={`${theme.icon} ${style.icon}`}></span>
        <div className={theme.header}>{i18n.t('cross_device.tips')}</div>
        <div className={`${style.help} ${theme.help}`}>
          <ul className={`${style.helpList} ${theme.helpList}`}>
            <li>{i18n.t('cross_device.mobile_connected.tips.item_1')}</li>
            <li>{i18n.t('cross_device.mobile_connected.tips.item_2')}</li>
            <li>{i18n.t('cross_device.mobile_connected.tips.item_3')}</li>
          </ul>
        </div>
        <a href='#' className={style.cancel}
           onClick={preventDefaultOnClick(back)}>{i18n.t('cancel')}</a>
      </div>
    </div>
  )
}

export default trackComponent(MobileConnected, 'mobile_connected')
