import { h, Component} from 'preact'

import theme from '../Theme/style.css'
import style from './style.css'
import Title from '../Title'
import {preventDefaultOnClick} from '../utils'
import {sendScreen} from '../../Tracker'

class PrivacyStatement extends Component {
  componentDidMount() {
    sendScreen(['privacy'])
  }

  render({i18n, back, acceptTerms}) {
    const title = i18n.t('privacy.title')
    return (
      <div className={style.privacy}>
        <Title {...{title}} />
        <div className={`${theme.thickWrapper} ${style.content}`}>
          <ul className={style.list}>
            <li className={style.item}>{i18n.t('privacy.item_1')}</li>
            <li className={style.item}>{i18n.t('privacy.item_2')}</li>
            <li className={style.item}>{i18n.t('privacy.item_3')}</li>
          </ul>

          <div>
            <div className={style.smallPrint}>
              {i18n.t('privacy.small_print_p1')}
              <a href='https://onfido.com/termofuse' target='_blank'>{i18n.t('privacy.terms_link')}</a>
              {i18n.t('privacy.small_print_p2')}
              <a href='https://onfido.com/privacy' target='_blank'>{i18n.t('privacy.privacy_link')}</a>
            </div>
            <div className={style.actions}>
              <button onClick={preventDefaultOnClick(back)}
                className={`${theme.btn} ${style.decline}`}>
                {i18n.t('privacy.decline')}
              </button>
              <button href='#' className={`${theme.btn} ${theme["btn-primary"]} ${style.primary}`}
                onClick={preventDefaultOnClick(acceptTerms)}>
                {i18n.t('privacy.continue')}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default PrivacyStatement
