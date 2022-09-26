import { ComponentType, h } from 'preact'
import { Button } from '@onfido/castor-react'
import classNames from 'classnames'
import PageTitle from '../../PageTitle'
import { trackComponent } from '../../../Tracker'
import {
  buildComponentsList,
  ComponentsListProps,
} from '../../Router/StepComponentMap'
import { localised } from '~locales'
import { CROSS_DEVICE_INTRO_LOCALES_MAPPING } from '~utils/localesMapping'
import theme from '../../Theme/style.scss'
import style from './style.scss'
import { WithLocalisedProps, WithTrackingProps } from '~types/hocs'
import { MobileConfig } from '~types/commons'
import { StepComponentProps } from '~types/routers'

const previousComponentType = ({
  flow,
  documentType,
  poaDocumentCountry,
  steps,
  step,
}: ComponentsListProps & { step?: number }) =>
  buildComponentsList({
    flow,
    documentType,
    poaDocumentCountry,
    steps,
  })[step || 0].step.type

type stageIconKeys = keyof typeof CROSS_DEVICE_INTRO_LOCALES_MAPPING
const getStageIcon = (key: stageIconKeys, isFace: boolean) => {
  const iconPrefix = 'stageIcon'
  if (key !== 'take-photos') {
    return `${iconPrefix}-${key}`
  }
  return isFace ? `${iconPrefix}-take-selfie` : `${iconPrefix}-take-photos`
}

type IntroProps = {
  mobileConfig: MobileConfig
  nextStep: () => void
} & WithLocalisedProps &
  WithTrackingProps

const Intro = ({ translate, nextStep, mobileConfig }: IntroProps) => {
  const isFace =
    previousComponentType({
      // TODO: Check with reviewers: is this always captureSteps as it isn't available in mobileConfig?
      flow: 'captureSteps',
      documentType: mobileConfig.documentType,
      poaDocumentCountry: mobileConfig.poaDocumentCountry,
      steps: mobileConfig.steps,
    }) === 'face'

  const stageList = Object.keys(
    CROSS_DEVICE_INTRO_LOCALES_MAPPING
  ) as Array<stageIconKeys>

  return (
    <div
      className={classNames(theme.fullHeightMobileContainer, style.container)}
      data-page-id={'CrossDeviceIntro'}
    >
      <PageTitle
        title={translate('cross_device_intro.title')}
        subTitle={translate('cross_device_intro.subtitle')}
      />
      <ol
        aria-label={translate('cross_device_intro.list_accessibility')}
        className={classNames(style.content, style.list)}
      >
        {stageList.map((key) => (
          <li key={key} className={style.stage}>
            <div
              className={classNames(
                style.stageIcon,
                style[getStageIcon(key, isFace)]
              )}
            />
            <div
              className={classNames(
                style.stageMessage,
                style[`stageMessage-${key}`]
              )}
            >
              {translate(CROSS_DEVICE_INTRO_LOCALES_MAPPING[key])}
            </div>
          </li>
        ))}
      </ol>
      <div className={classNames(theme.contentMargin, style.buttonContainer)}>
        <Button
          type="button"
          variant="primary"
          className={classNames(theme['button-centered'], theme['button-lg'])}
          onClick={nextStep}
          data-onfido-qa="cross-device-continue-btn"
        >
          {translate('cross_device_intro.button_primary')}
        </Button>
      </div>
    </div>
  )
}

export default trackComponent(
  localised(Intro)
) as ComponentType<StepComponentProps>
