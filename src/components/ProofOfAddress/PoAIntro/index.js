import { h } from 'preact'
import classNames from 'classnames'
import PageTitle from '../../PageTitle'
import { Button } from '@onfido/castor'
import { trackComponent } from '../../../Tracker'
import { localised } from '../../../locales'
import theme from '../../Theme/style.scss'
import style from './style.scss'

const PoAIntro = ({ country, translate, parseTranslatedTags, nextStep }) => (
  <div className={theme.fullHeightContainer}>
    <PageTitle
      title={translate('proof_of_address.intro.title', {
        country: !country || country === 'GBR' ? 'UK' : '',
      })}
    />
    <div className={style.content}>
      <p className={style.requirements}>
        {translate('proof_of_address.intro.requirements')}
      </p>
      {['shows_address', 'matches_signup', 'is_recent'].map((key) => (
        <div key={key} className={style.requirement}>
          <span>
            {parseTranslatedTags(
              `proof_of_address.intro.${key}`,
              ({ text }) => (
                <span className={style.bolder}>{text}</span>
              )
            )}
          </span>
        </div>
      ))}
    </div>
    <div className={theme.thickWrapper}>
      <Button
        variant="primary"
        size="large"
        className={classNames(theme['button-centered'], theme['button-lg'])}
        onClick={nextStep}
        data-onfido-qa="poa-start-btn"
      >
        {translate('proof_of_address.intro.start')}
      </Button>
    </div>
  </div>
)

export default trackComponent(localised(PoAIntro))
