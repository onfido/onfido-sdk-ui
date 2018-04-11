import { h, Component } from 'preact'

import { trackComponent } from '../../../Tracker'
import {preventDefaultOnClick} from '../../utils'
import Title from '../../Title'
import theme from '../../Theme/style.css'
import style from './style.css'

class CrossDeviceSubmit extends Component {
  hasMultipleDocuments = () => {
    const {steps} = this.props
    const documentSteps = steps.filter(step =>
      step.type === 'document'
    )
    return documentSteps.length > 1
  }

  hasFace = () => {
    const {steps} = this.props
    return steps.filter(step => {
      return step.type === 'face'
    }).length > 0
  }

  render () {
    const i18n = this.props.i18n
    const documentCopy = this.hasMultipleDocuments() ? i18n.t('cross_device.submit.multiple_docs_uploaded') : i18n.t('cross_device.submit.one_doc_uploaded')
    return (
      <div>
        <Title title={i18n.t('cross_device.submit.title')} subTitle={i18n.t('cross_device.submit.sub_title')} />
        <div className={theme.thickWrapper}>
          <ul className={style.uploadList}>
            <li>
              <span className={`${theme.icon} ${style.icon}`}/>
              <span className={style.listText}>{documentCopy}</span>
            </li>
            { this.hasFace() &&
              <li>
                <span className={`${theme.icon} ${style.icon}`}/>
                <span className={style.listText}>{i18n.t('cross_device.submit.selfie_uploaded')}</span>
              </li>
            }
          </ul>

          <div>
            <button
              className={`${theme.btn} ${theme["btn-primary"]} ${theme["btn-centered"]}`}
              onClick={preventDefaultOnClick(this.props.nextStep)}
            >
            {i18n.t('cross_device.submit.action')}
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default trackComponent(CrossDeviceSubmit, 'desktop_submit')
