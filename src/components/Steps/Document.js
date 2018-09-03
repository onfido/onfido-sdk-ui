import { h, Component } from 'preact'
import { appendToTracking } from '../../Tracker'
import { AutoShot } from '../Photo'
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

  handleImage = (blob, base64) => this.handleCapture({ blob, base64 })

  handleValidAutoShot = (blob, base64, id) => this.handleCapture({ blob, base64, id })

  handleUploadFallback = file => fileToLossyBase64Image(file,
    (blob, base64) => this.handleCapture({ blob, base64 }),
    () => {},
  )

  handleError = () => this.props.actions.deleteCapture()

  render() {
    const { useWebcam, hasCamera, documentType, side, i18n, subTitle, isFullScreen } = this.props
    const copyNamespace = `capture.${documentType}.${side}`
    const title = i18n.t(`${copyNamespace}.title`)
    const uploadTitle = i18n.t(`${copyNamespace}.upload_title`) || title
    const instructions = i18n.t(`${copyNamespace}.instructions`)
    const moreProps = {...this.props, title, onError: this.handleError }

    return useWebcam && hasCamera ? 
      <AutoShot
        {...moreProps}
        method="document"
        containerClassName={style.documentContainer}
        onValidShot={ this.handleValidAutoShot }
        onUploadFallback={ this.handleUploadFallback }
        renderTitle={ <Title {...{title, subTitle, isFullScreen}} smaller /> }
      /> :
      <Uploader
        onUpload={ this.handleImage }
        {...moreProps}
        {...{instructions, title: uploadTitle }}
      />
  }
}

export default compose(
  appendToTracking,
  withPrivacyStatement,
  withCameraDetection,
  withFlowChangeOnDisconnectCamera,
)(Document)
