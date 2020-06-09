import { h } from 'preact'
import theme from '../../Theme/style.css'
import style from './style.css'
import PageTitle from '../../PageTitle'
import Button from '../../Button'
import {trackComponent} from '../../../Tracker'
import {localised} from '../../../locales'

const PoAIntro = ({country, translate, parseTranslatedTags, nextStep}) => (
  <div className={theme.fullHeightContainer}>
    <PageTitle title={translate('proof_of_address.intro.title', {
      country: !country || country === 'GBR' ? 'UK' : '',
    })} />
    <div className={style.content}>
      <p className={style.requirements}>{translate('proof_of_address.intro.requirements')}</p>
      {
        ['shows_address', 'matches_signup', 'is_recent'].map(key =>
          <div key={key} className={style.requirement}>
            <span>
            {parseTranslatedTags(`proof_of_address.intro.${key}`, ({ text }) => (
              <span className={style.bolder}>{text}</span>
            ))}
            </span>
          </div>
        )
      }
    </div>
    <div className={theme.thickWrapper}>
      <Button
        variants={["primary", "centered", "lg"]}
        onClick={nextStep}
      >
        {translate('proof_of_address.intro.start')}
      </Button>
    </div>
  </div>
)

export default trackComponent(localised(PoAIntro))
