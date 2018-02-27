import { h } from 'preact'
import theme from '../theme/style.css'
import style from './style.css'

import Title from '../Title'

const PrivacyStatement = ({i18n}) => {
  const title = i18n.t('privacy.title')
  return (
    <div className={style.privacy}>
      <Title {...{title}} />
      <ul>
        <li>{i18n.t('privacy.item_1')}</li>
        <li>{i18n.t('privacy.item_2')}</li>
        <li>{i18n.t('privacy.item_3')}</li>
      </ul>

      <div className={style.smallPrint}>
        <p>
          {i18n.t('privacy.small_print_p1')}
          <a href=''>{i18n.t('privacy.terms_link')}</a>
          {i18n.t('privacy.small_print_p2')}
          <a href=''>{i18n.t('privacy.privacy_link')}</a>
        </p>
      </div>
      <div className={style.actions}>
        <button onClick=''
          className={`${theme.btn} ${style["btn-outline"]}`}>
          {i18n.t('confirm.decline')}
        </button>

      </div>
    </div>
  )
}

export default PrivacyStatement
