import { h, Component} from 'preact'

import theme from '../Theme/style.css'
import style from './style.css'
import Title from '../Title'
import {preventDefaultOnClick} from '../utils'
import {sendScreen} from '../../Tracker'
import {parseI18nWithXmlTags, localised} from '../../locales'

const externalUrls = {
  terms: process.env.ONFIDO_TERMS_URL,
  privacy: process.env.ONFIDO_PRIVACY_URL
}

class PrivacyStatement extends Component {
  componentDidMount() {
    sendScreen(['privacy'])
  }

  render({translate, back, acceptTerms}) {
    const title = translate('privacy.title')
    return (
      <div className={style.privacy}>
        <Title {...{title}} />
        <div className={`${theme.thickWrapper} ${style.content}`}>
          <ul className={style.list}>
            <li className={style.item}>{translate('privacy.item_1')}</li>
            <li className={style.item}>{translate('privacy.item_2')}</li>
            <li className={style.item}>{translate('privacy.item_3')}</li>
          </ul>

          <div>
            <div className={style.smallPrint}>
              { parseI18nWithXmlTags(translate, 'privacy.small_print', tagElement => (
                 <a href={externalUrls[tagElement.type]} target='_blank'>{tagElement.text}</a>
              ))}
            </div>
            <div className={style.actions}>
              <button onClick={preventDefaultOnClick(back)}
                className={`${theme.btn} ${style.decline}`}>
                {translate('privacy.decline')}
              </button>
              <button href='#' className={`${theme.btn} ${theme["btn-primary"]} ${style.primary}`}
                onClick={preventDefaultOnClick(acceptTerms)}>
                {translate('privacy.continue')}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default localised(PrivacyStatement)
