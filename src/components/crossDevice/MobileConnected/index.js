import { h } from 'preact'

import theme from '../../Theme/style.css'
import style from './style.css'
import Title from '../../Title'
import { trackComponent } from '../../../Tracker'
import {preventDefaultOnClick} from '../../utils'
import { localised } from '../../../locales'

const MobileConnected = ({t, back}) => {
  return (
    <div>
      <Title
        title={t('cross_device.mobile_connected.title.message')}
        subTitle={t('cross_device.mobile_connected.title.submessage')}
      />
      <div className={theme.thickWrapper}>
        <span className={`${theme.icon} ${style.icon}`}></span>
        <div className={theme.header}>{t('cross_device.tips')}</div>
        <div className={`${style.help} ${theme.help}`}>
          <ul className={`${style.helpList} ${theme.helpList}`}>
            <li>{t('cross_device.mobile_connected.tips.item_1')}</li>
            <li>{t('cross_device.mobile_connected.tips.item_2')}</li>
            <li>{t('cross_device.mobile_connected.tips.item_3')}</li>
          </ul>
        </div>
        <a href='#' className={style.cancel}
           onClick={preventDefaultOnClick(back)}>{t('cancel')}</a>
      </div>
    </div>
  )
}

export default trackComponent(localised(MobileConnected), 'mobile_connected')
