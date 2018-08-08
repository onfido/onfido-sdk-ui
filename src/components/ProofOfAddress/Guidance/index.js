import { h } from 'preact'
import classNames from 'classnames'
import theme from '../../Theme/style.css'
import style from './style.css'
import Title from '../../Title'
import {trackComponent} from '../../../Tracker'
import {preventDefaultOnClick} from '../../utils'
import {parseI18nWithXmlTags} from '../../../locales'

const kebabCase = str => str.replace(/_/g, '-')

const Guidance = ({i18n, documentType, nextStep}) => {
  return (
    <div className={theme.fullHeightContainer}>
      <Title
        title={i18n.t(`capture.${documentType}.front.title`)}
        subTitle={
          <span className={style.subTitle}>
            {parseI18nWithXmlTags(i18n, `capture.${documentType}.front.sub_title`, ({ text }) => (
              <span className={style.bolder}>{text}</span>
            ))}
          </span>
        }
      />
      <div className={style.content}>
        <div className={style.makeSure}>{i18n.t('proof_of_address.guidance.make_sure_it_shows')}</div>
        <div className={style.image}>
          <div className={style.labels}>
          {
            ['logo', 'full_name', 'current_address', 'issue_date'].map(label =>
              <span  
                key={label}
                className={classNames(style.label, style[`label-${kebabCase(label)}`])}
              >
                <span className={style.labelCopy}>
                  {i18n.t(`proof_of_address.guidance.${label}`)}
                </span>
              </span>
            )
          }
          </div>
        </div>
      </div>
      <div className={theme.thickWrapper}>
        <button
          className={`${theme.btn} ${theme['btn-primary']} ${theme['btn-centered']}`}
          onClick={preventDefaultOnClick(nextStep)}
        >
        {i18n.t('proof_of_address.guidance.continue')}
        </button>
      </div>
    </div>
  )
}

export default trackComponent(Guidance)
