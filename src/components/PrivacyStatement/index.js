import { h } from 'preact'
import theme from '../Theme/style.css'
import style from './style.css'

import Title from '../Title'
import {preventDefaultOnClick} from '../utils'

const PrivacyStatement = ({acceptTerms, back, i18n}) => {
  const title = i18n.t('privacy.title')
  return (
    <div className={style.privacy}>
      <Title {...{title}} />
      <div className={`${theme.thickWrapper} ${style.content}`}>
        <ul className={style.list}>
          <li>{i18n.t('privacy.item_1')}</li>
          <li>{i18n.t('privacy.item_2')}</li>
          <li>{i18n.t('privacy.item_3')}</li>
        </ul>

        <div className={style.bottomSection}>
          <div className={style.smallPrint}>
            <p>
              {i18n.t('privacy.small_print_p1')}
              <a href=''>{i18n.t('privacy.terms_link')}</a>
              {i18n.t('privacy.small_print_p2')}
              <a href=''>{i18n.t('privacy.privacy_link')}</a>
            </p>
          </div>
          <div className={style.actions}>
            <button onClick={preventDefaultOnClick(back)}
              className={`${theme.btn} ${style["btn-outline"]}`}>
              {i18n.t('privacy.decline')}
            </button>
            <button href='#' className={`${theme.btn} ${theme["btn-primary"]}`}
              onClick={preventDefaultOnClick(acceptTerms)}>
              {i18n.t('privacy.continue')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyStatement
