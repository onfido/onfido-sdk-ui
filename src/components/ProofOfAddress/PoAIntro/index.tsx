import { FunctionComponent, h } from 'preact'
import theme from '../../Theme/style.scss'
import PageTitle from '../../PageTitle'
import { Button } from '@onfido/castor-react'
import classNames from 'classnames'
import { useLocales } from '~locales'
import { POA_INTRO_LOCALES_MAPPING } from '~utils/localesMapping'
import { trackComponent } from '../../../Tracker'
import { StepComponentBaseProps } from '~types/routers'
import style from './style.scss'
import { CountryData } from '~types/commons'

type Props = {
  poaDocumentCountry?: CountryData | undefined
} & StepComponentBaseProps

const PoAClientIntro: FunctionComponent<Props> = ({ nextStep }) => {
  const { translate, parseTranslatedTags } = useLocales()

  return (
    <div className={theme.fullHeightContainer} data-page-id={'PoAIntro'}>
      <PageTitle title={translate('poa_intro.title')} />
      <div className={style.content}>
        <p className={style.requirements}>{translate('poa_intro.subtitle')}</p>
        {['shows_address', 'matches_signup', 'most_recent'].map((key) => (
          <div key={key} className={style.requirement}>
            <span>
              {parseTranslatedTags(
                POA_INTRO_LOCALES_MAPPING[key],
                ({ text }) => (
                  <span className={style.bolder}>{text}</span>
                )
              )}
            </span>
          </div>
        ))}
      </div>
      <div className={theme.contentMargin}>
        <Button
          type="button"
          variant="primary"
          className={classNames(theme['button-centered'], theme['button-lg'])}
          onClick={nextStep}
          data-onfido-qa="poa-start-btn"
        >
          {translate('poa_intro.button_primary')}
        </Button>
      </div>
    </div>
  )
}

export default trackComponent(PoAClientIntro, 'poa_client_intro')
