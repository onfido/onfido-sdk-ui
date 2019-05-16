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

  hasFace = () => {
    const {steps} = this.props
    return steps.filter(step => {
      return step.type === 'face'
    }).length > 0
  }

  faceVariant = () => {
    const { captures = {} } = this.props
    const { face = {} } = captures
    return face ? face.variant : 'standard'
  }

  render () {
    const { translate, nextStep } = this.props
    const documentCopy = this.hasMultipleDocuments() ? translate('cross_device.submit.multiple_docs_uploaded') : translate('cross_device.submit.one_doc_uploaded')
    return (
      <div>
        <PageTitle title={translate('cross_device.submit.title')} subTitle={translate('cross_device.submit.sub_title')} />
        <div className={theme.thickWrapper}>
          <ul className={style.uploadList}>
            <li>
              <span className={`${theme.icon} ${style.icon}`}/>
              <span className={style.listText}>{documentCopy}</span>
            </li>
            { this.hasFace() &&
              <li>
                <span className={`${theme.icon} ${style.icon}`}/>
                <span className={style.listText}>{
                  translate(`cross_device.submit.${
                    this.faceVariant() === 'standard' ? 'selfie' : 'video'
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
