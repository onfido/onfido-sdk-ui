import { h } from 'preact'
import { Button } from '@onfido/castor-react'
import classNames from 'classnames'
import PageTitle from '../../PageTitle'
import { trackComponent } from '../../../Tracker'
import { buildComponentsList } from '../../Router/StepComponentMap'
import { localised } from '../../../locales'
import { CROSS_DEVICE_INTRO_LOCALES_MAPPING } from '~utils/localesMapping'
import theme from '../../Theme/style.scss'
import style from './style.scss'

const previousComponentType = ({
  flow = 'captureSteps',
  documentType,
  poaDocumentType,
  steps,
  step,
}) =>
  buildComponentsList({ flow, documentType, poaDocumentType, steps })[step || 0]
    .step.type

const getStageIcon = (key, isFace) => {
  const iconPrefix = 'stageIcon'
  if (key !== 'take-photos') {
    return `${iconPrefix}-${key}`
  }
  return isFace ? `${iconPrefix}-take-selfie` : `${iconPrefix}-take-photos`
}

const Intro = ({ translate, nextStep, mobileConfig }) => {
  const isFace = previousComponentType(mobileConfig) === 'face'
  const stageList = Object.keys(CROSS_DEVICE_INTRO_LOCALES_MAPPING)

  return (
    <div
      className={classNames(theme.fullHeightMobileContainer, style.container)}
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

export default trackComponent(localised(Intro))
