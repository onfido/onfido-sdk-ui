import { h, Component } from 'preact'
import { appendToTracking } from '../../Tracker'
import DocumentAutoCapture from '../Photo/DocumentAutoCapture'
import Uploader from '../Uploader'
import Title from '../Title'
import withPrivacyStatement from './withPrivacyStatement'
import withCameraDetection from './withCameraDetection'
import withFlowChangeOnDisconnectCamera from './withFlowChangeOnDisconnectCamera'
import { compose } from '../utils/func'
import { randomId } from '../utils/string'
import { fileToLossyBase64Image } from '../utils/file.js'
import style from './style.css'

class Document extends Component {
  static defaultProps = {
    side: 'front',
  }

  handleCapture = payload => {
    const { documentType, actions, side, nextStep } = this.props
    actions.createCapture({
      ...payload,
      method: 'document',
      documentType: documentType === 'poa' ? 'unknown' : documentType,
      side,
      id: payload.id || randomId(),
    })

    nextStep()
  }

  handleUpload = file => fileToLossyBase64Image(file,
    base64 => this.handleCapture({ blob: file, base64 }),
    () => {}
  )

  handleError = () => this.props.actions.deleteCapture()

  render() {
    const { useWebcam, hasCamera, documentType, side, i18n, subTitle, isFullScreen } = this.props
    const copyNamespace = `capture.${documentType}.${side}`
    const title = i18n.t(`${copyNamespace}.title`)
    const moreProps = {...this.props, title, onError: this.handleError }

    return useWebcam && hasCamera ?
      <DocumentAutoCapture
        {...moreProps}
        method="document"
        containerClassName={style.documentContainer}
        onValidCapture={ this.handleCapture }
        onUploadFallback={ this.handleUpload }
        renderTitle={ <Title {...{title, subTitle, isFullScreen}} smaller /> }
      /> :
      <Uploader
        {...moreProps}
        onUpload={ this.handleUpload }
        title={i18n.t(`${copyNamespace}.upload_title`) || title}
        instructions={i18n.t(`${copyNamespace}.instructions`)}
      />
  }
}

export default compose(
  appendToTracking,
  withPrivacyStatement,
  withCameraDetection,
  withFlowChangeOnDisconnectCamera,
)(Document)
