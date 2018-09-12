import { h } from 'preact'
import theme from '../../Theme/style.css'
import style from './style.css'
import Title from '../../Title'
import {trackComponent} from '../../../Tracker'
import {preventDefaultOnClick} from '../../utils'
import {parseI18nWithXmlTags, localised} from '../../../locales'

const PoAIntro = ({translate, nextStep}) => (
  <div className={theme.fullHeightContainer}>
    <Title title={translate('proof_of_address.intro.title')} />
    <div className={style.content}>
      <p className={style.requirements}>{translate('proof_of_address.intro.requirements')}</p>
      {
        ['shows_address', 'matches_signup', 'is_recent'].map(key =>
          <div key={key} className={style.requirement}>
            <span>
            {parseI18nWithXmlTags(translate, `proof_of_address.intro.${key}`, ({ text }) => (
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
        onClick={preventDefaultOnClick(nextStep)}
      >
      {translate('proof_of_address.intro.start')}
      </button>
    </div>
  </div>
)

export default trackComponent(localised(PoAIntro))
