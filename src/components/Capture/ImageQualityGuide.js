import { h, Component } from 'preact'
import classNames from 'classnames'
import { localised } from '../../locales'
import { trackComponentAndMode } from '../../Tracker'
import { isDesktop, addDeviceRelatedProperties } from '~utils'
import { findKey } from '~utils/object'
import { isOfMimeType } from '~utils/blob'
import { randomId } from '~utils/string'
import theme from '../Theme/style.css'
import style from './style.css'
import PageTitle from '../PageTitle'
import Button from '../Button'
import CustomFileInput from '../CustomFileInput'

class ImageQualityGuide extends Component<Props, State> {
  static defaultProps = {
    onUpload: () => {},
    acceptedTypes: ['jpg', 'jpeg', 'png', 'pdf'],
    maxSize: 10000000, // The Onfido API only accepts files below 10 MB
  }

  setError = (name) => this.setState({ error: { name } })

  findError = (file) => {
    const { acceptedTypes, maxSize } = this.props
    return findKey(
      {
        INVALID_TYPE: (file) => !isOfMimeType(acceptedTypes, file),
        INVALID_SIZE: (file) => file.size > maxSize,
      },
      (checkFn) => checkFn(file)
    )
  }

  createCapture = (file) => {
    const payload = { blob: file, sdkMetadata: { captureMethod: 'html5' } }
    const { documentType, actions, mobileFlow } = this.props
    const documentCaptureData = {
      ...payload,
      sdkMetadata: addDeviceRelatedProperties(payload.sdkMetadata, mobileFlow),
      method: 'document',
      side: 'front',
      documentType,
      id: randomId(),
    }
    actions.createCapture(documentCaptureData)
  }

  handleFileSelected = (file) => {
    const error = this.findError(file)
    if (error) {
      this.setError(error)
    } else {
      this.createCapture(file)
      this.props.nextStep()
    }
  }

  renderUploadButton = () => (
    <Button variants={['centered', 'primary']} className={style.button}>
      {this.props.translate('image_quality_guide.next_step')}
    </Button>
  )

  render() {
    const { translate } = this.props
    return (
      <div className={theme.fullHeightContainer}>
        <PageTitle
          title={translate('image_quality_guide.title')}
          subTitle={translate('image_quality_guide.sub_title')}
        />
        <div
          className={classNames(theme.thickWrapper, style.imageQualityGuide)}
        >
          <div className={style.imageQualityGuideRow}>
            <div className={style.documentExampleCol}>
              <div
                role="img"
                aria-label={translate('image_quality_guide.img_alt_text')}
                className={classNames(
                  style.documentExampleImg,
                  style.documentExampleImgCutoff
                )}
              />
              <div className={style.documentExampleLabel}>
                {translate('image_quality_guide.not_cut_off')}
              </div>
            </div>
            <div className={style.documentExampleCol}>
              <div
                role="img"
                aria-label={translate('image_quality_guide.img_alt_text')}
                className={classNames(
                  style.documentExampleImg,
                  style.documentExampleImgBlur
                )}
              />
              <div className={style.documentExampleLabel}>
                {translate('image_quality_guide.no_blur')}
              </div>
            </div>
          </div>
          <div className={style.imageQualityGuideRow}>
            <div className={style.documentExampleCol}>
              <div
                role="img"
                aria-label={translate('image_quality_guide.img_alt_text')}
                className={classNames(
                  style.documentExampleImg,
                  style.documentExampleImgGlare
                )}
              />
              <div className={style.documentExampleLabel}>
                {translate('image_quality_guide.no_glare')}
              </div>
            </div>
            <div className={style.documentExampleCol}>
              <div
                role="img"
                aria-label={translate('image_quality_guide.img_alt_text')}
                className={classNames(
                  style.documentExampleImg,
                  style.documentExampleImgGood
                )}
              />
              <div className={style.documentExampleLabel}>
                {translate('image_quality_guide.all_good')}
              </div>
            </div>
          </div>
          {isDesktop ? (
            <CustomFileInput
              className={style.buttonContainer}
              onChange={this.handleFileSelected}
            >
              {this.renderUploadButton()}
            </CustomFileInput>
          ) : (
            <CustomFileInput
              className={style.buttonContainer}
              onChange={this.handleFileSelected}
              accept="image/*"
              capture
            >
              {this.renderUploadButton()}
            </CustomFileInput>
          )}
        </div>
      </div>
    )
  }
}

export default trackComponentAndMode(
  localised(ImageQualityGuide),
  'image_quality_guide',
  'error'
)
