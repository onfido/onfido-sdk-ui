import { h, Component } from 'preact'
import { connect } from 'react-redux'
import { trackComponent } from '../../../Tracker'
import PageTitle from '../../PageTitle'
import Button from '../../Button'
import theme from '../../Theme/style.css'
import style from './style.css'
import { localised } from '../../../locales'

class CrossDeviceSubmit extends Component {
  hasMultipleDocuments = () => {
    const {steps} = this.props
    const documentSteps = steps.filter(step =>
      step.type === 'document'
    )
    return documentSteps.length > 1
  }

  hasFaceCaptureStep = () => {
    const {steps} = this.props
    return steps.filter(step => {
      return step.type === 'face'
    }).length > 0
  }

  faceCaptureVariant = () => {
    const { captures = {} } = this.props
    const { face = {} } = captures
    return face && face.metadata ? face.metadata.variant : 'standard'
  }

  render () {
    const { translate, nextStep } = this.props
    const documentCopy = this.hasMultipleDocuments() ? 'cross_device.submit.multiple_docs_uploaded' : 'cross_device.submit.one_doc_uploaded'
    return (
      <div>
        <PageTitle title={translate('cross_device.submit.title')} subTitle={translate('cross_device.submit.sub_title')} />
        <div className={theme.thickWrapper}>
          <ul className={style.uploadList} aria-label={translate('cross_device.tips')} >
            <li>
              <span className={`${theme.icon} ${style.icon}`}/>
              <span className={style.listText}>{translate(documentCopy)}</span>
            </li>
            { this.hasFaceCaptureStep() &&
              <li>
                <span className={`${theme.icon} ${style.icon}`}/>
                <span className={style.listText}>{
                  translate(`cross_device.submit.${
                    this.faceCaptureVariant() === 'standard' ? 'selfie' : 'video'
                  }_uploaded`)
                }</span>
              </li>
            }
          </ul>

          <div>
            <Button
              variants={["primary", "centered"]}
              onClick={nextStep}
            >
              {translate('cross_device.submit.action')}
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ captures }) => ({ captures })

export default connect(mapStateToProps)(trackComponent(localised(CrossDeviceSubmit), 'desktop_submit'))
