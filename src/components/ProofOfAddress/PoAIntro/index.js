import { h } from 'preact'
import PageTitle from '../../PageTitle'
import Button from '../../Button'
import { trackComponent } from '../../../Tracker'
import { localised } from '../../../locales'
import { POA_INTRO_LOCALES_MAPPING } from '~utils/localesMapping'
import theme from '../../Theme/style.scss'
import style from './style.scss'

const PoAIntro = ({ country, translate, parseTranslatedTags, nextStep }) => (
  <div className={theme.fullHeightContainer}>
    <PageTitle
      title={translate('poa_intro.title', {
        country: !country || country === 'GBR' ? 'UK' : '',
      })}
    />
    <div className={style.content}>
      <p className={style.requirements}>{translate('poa_intro.subtitle')}</p>
      {['shows_address', 'matches_signup', 'most_recent'].map((key) => (
        <div key={key} className={style.requirement}>
          <span>
            {parseTranslatedTags(POA_INTRO_LOCALES_MAPPING[key], ({ text }) => (
              <span className={style.bolder}>{text}</span>
            ))}
          </span>
        </div>
      ))}
    </div>
    <div className={theme.thickWrapper}>
      <Button variants={['primary', 'centered', 'lg']} onClick={nextStep}>
        {translate('poa_intro.button_primary')}
      </Button>
    </div>
  </div>
)

export default trackComponent(localised(PoAIntro))
