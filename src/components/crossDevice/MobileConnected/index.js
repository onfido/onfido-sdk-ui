import { h } from 'preact'

import theme from '../../Theme/style.css'
import style from './style.css'
import Title from '../../Title'
import { trackComponent } from '../../../Tracker'
import {preventDefaultOnClick} from '../../utils'
import { localised } from '../../../locales'

const MobileConnected = ({translate, back}) => {
  return (
    <div>
      <Title
        title={translate('cross_device.mobile_connected.title.message')}
        subTitle={translate('cross_device.mobile_connected.title.submessage')}
      />
      <div className={theme.thickWrapper}>
        <span className={`${theme.icon} ${style.icon}`}></span>
        <div className={theme.header}>{translate('cross_device.tips')}</div>
        <div className={`${style.help} ${theme.help}`}>
          <ul className={`${style.helpList} ${theme.helpList}`}>
            <li>{translate('cross_device.mobile_connected.tips.item_1')}</li>
            <li>{translate('cross_device.mobile_connected.tips.item_2')}</li>
            <li>{translate('cross_device.mobile_connected.tips.item_3')}</li>
          </ul>
        </div>
        <a href='#' className={style.cancel}
           onClick={preventDefaultOnClick(back)}>{translate('cancel')}</a>
      </div>
    </div>
  )
}

export default trackComponent(localised(MobileConnected), 'mobile_connected')
