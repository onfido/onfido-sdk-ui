import { trackComponent } from '../../../Tracker'
import { useLocales } from '~locales'
import { ComponentType, FunctionComponent, h } from 'preact'
import { StepComponentProps } from '~types/routers'
import theme from '../../Theme/style.scss'
import PageTitle from '../../PageTitle'
import style from './style.scss'
import { Button } from '@onfido/castor-react'
import classNames from 'classnames'
import {
  POA_GUIDANCE_LOCALES_MAPPING,
  POA_REQUIREMENTS_LOCALES_MAPPING,
} from '~utils/localesMapping'

type Props = StepComponentProps & {
  poaDocumentType: string
}

const Guidance: FunctionComponent<Props> = ({ nextStep, poaDocumentType }) => {
  const { translate, parseTranslatedTags } = useLocales()

  return (
    <div className={theme.fullHeightContainer} data-page-id={'PoAGuidance'}>
      <PageTitle
        title={translate(POA_GUIDANCE_LOCALES_MAPPING[poaDocumentType].title)}
        subTitle={
          <span className={style.subTitle}>
            {parseTranslatedTags(
              POA_GUIDANCE_LOCALES_MAPPING[poaDocumentType].subtitle,
              ({ text }) => (
                <span className={style.bolder}>{text}</span>
              )
            )}
          </span>
        }
      />
      <div className={style.content}>
        <div className={style.makeSure}>
          {translate('poa_guidance.instructions.label')}
        </div>
        {['logo', 'full_name', 'address', 'issue_date'].map((key) => (
          <div key={key} className={style.requirement}>
            <span>
              {parseTranslatedTags(
                POA_REQUIREMENTS_LOCALES_MAPPING[key],
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
          data-onfido-qa="poa-continue-btn"
        >
          {translate('poa_guidance.button_primary')}
        </Button>
      </div>
    </div>
  )
}

export default trackComponent(Guidance) as ComponentType<StepComponentProps>
