import { h } from 'preact'
import classNames from 'classnames'
import theme from '../../Theme/style.css'
import style from './style.css'
import PageTitle from '../../PageTitle'
import Button from '../../Button'
import { trackComponent } from '../../../Tracker'
import { componentsList } from '../../Router/StepComponentMap'
import { localised } from '../../../locales'

const previousComponentType = ({flow = 'captureSteps', documentType, poaDocumentType, steps, step}) =>
  componentsList({ flow, documentType, poaDocumentType, steps })[step || 0].step.type

const getStageIcon = (key, isFace) => {
  const iconPrefix = 'stageIcon'
  if (key !== 'take-photos') {
    return `${iconPrefix}-${key}`
  }
  return isFace ? `${iconPrefix}-take-selfie` : `${iconPrefix}-take-photos`
}

const Intro = ({translate, nextStep, mobileConfig}) => {
  const isFace = previousComponentType(mobileConfig) === 'face'
  const stageListCopyByKey = {
    'sms': 'description_li_1',
    'take-photos': 'description_li_2',
    'return-to-computer': 'description_li_3'
  }
  const stageList = Object.keys(stageListCopyByKey)
  return (
    <div className={classNames(theme.fullHeightMobileContainer, style.container)}>
      <PageTitle
        title={translate(`cross_device.intro.title`)}
        subTitle={translate(`cross_device.intro.sub_title`)}
      />
      <ol
        aria-label={translate('accessibility.cross_device_verification')}
        className={classNames(theme.thickWrapper, style.content, style.list)}>
      {
        stageList.map(key =>
          <li key={key} className={style.stage}>
            <div className={classNames(style.stageIcon, style[getStageIcon(key, isFace)])}></div>
            <div className={classNames(style.stageMessage, style[`stageMessage-${key}`])}>
              {translate(`cross_device.intro.${stageListCopyByKey[key]}`)}
            </div>
          </li>)
      }
      </ol>
      <div className={classNames(theme.thickWrapper, style.buttonContainer)}>
        <Button
          variants={["primary", "centered", "lg"]}
          onClick={nextStep}
        >
          {translate(`cross_device.intro.action`)}
        </Button>
      </div>
    </div>
  )
}

export default trackComponent(localised(Intro))