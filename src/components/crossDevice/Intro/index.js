import { h } from 'preact'
import classNames from 'classnames'
import PageTitle from '../../PageTitle'
import Button from '../../Button'
import { trackComponent } from '../../../Tracker'
import { componentsList } from '../../Router/StepComponentMap'
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
  componentsList({ flow, documentType, poaDocumentType, steps })[step || 0].step
    .type

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
        title={translate('xdevice_intro.title')}
        subTitle={translate('xdevice_intro.subtitle')}
      />
      <ol
        aria-label={translate('xdevice_intro.list_accessibility')}
        className={classNames(theme.thickWrapper, style.content, style.list)}
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
      <div className={classNames(theme.thickWrapper, style.buttonContainer)}>
        <Button variants={['primary', 'centered', 'lg']} onClick={nextStep}>
          {translate('xdevice_intro.button_primary')}
        </Button>
      </div>
    </div>
  )
}

export default trackComponent(localised(Intro))
