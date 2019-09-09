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


const Intro = ({translate, nextStep, mobileConfig}) => {
  const isFace = previousComponentType(mobileConfig) === 'face'
  const stages = {
    'sms': 'sms',
    ...(isFace ?
      {'take-selfie': 'face.take_photos' } :
      {'take-photos': 'document.take_photos' }
    ),
    'return-computer': 'return_computer',
  }
  const stageList = Object.keys(stages)

  return (
    <div className={theme.fullHeightMobileContainer}>
      <PageTitle
        title={translate(`cross_device.intro.${ isFace ? 'face' : 'document' }.title`)}
      />
      <ol
        aria-label={translate('accessibility.cross_device_verification')}
        className={classNames(theme.thickWrapper, style.content, style.list)}>
      {
        stageList.map(key =>
          <li key={key} className={style.stage}>
            <div className={classNames(style.stageIcon, style[`stageIcon-${key}`])}></div>
            <div className={classNames(style.stageMessage, style[`stageMessage-${key}`])}>
              {translate(`cross_device.intro.${stages[key]}`)}
            </div>
          </li>
        )
      }
      </ol>
      <div className={theme.thickWrapper}>
        <Button
          variants={["primary", "centered"]}
          onClick={nextStep}
        >
          {translate(`cross_device.intro.${ isFace ? 'face' : 'document' }.action`)}
        </Button>
      </div>
    </div>
  )
}

export default trackComponent(localised(Intro))