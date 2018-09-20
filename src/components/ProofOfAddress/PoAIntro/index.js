import { h } from 'preact'
import theme from '../../Theme/style.css'
import style from './style.css'
import Title from '../../Title'
import {trackComponent} from '../../../Tracker'
import {preventDefaultOnClick} from '../../utils'
import {parseI18nWithXmlTags} from '../../../locales'
import { withFlowContext } from '../../Flow'

const PoAIntro = ({i18n, next}) => (
  <div className={theme.fullHeightContainer}>
    <Title title={i18n.t('proof_of_address.intro.title')} />
    <div className={style.content}>
      <p className={style.requirements}>{i18n.t('proof_of_address.intro.requirements')}</p>
      {
        ['shows_address', 'matches_signup', 'is_recent'].map(key =>
          <div key={key} className={style.requirement}>
            <span>
            {parseI18nWithXmlTags(i18n, `proof_of_address.intro.${key}`, ({ text }) => (
              <span className={style.bolder}>{text}</span>
            ))}
            </span>
          </div>
        )
      }
    </div>
    <div className={theme.thickWrapper}>
      <button
        className={`${theme.btn} ${theme['btn-primary']} ${theme['btn-centered']}`}
        onClick={preventDefaultOnClick(next)}
      >
      {i18n.t('proof_of_address.intro.start')}
      </button>
    </div>
  </div>
)

export default trackComponent(withFlowContext(PoAIntro))
