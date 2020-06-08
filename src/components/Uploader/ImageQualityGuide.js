import { h, Component } from 'preact'
import classNames from 'classnames'
import { localised } from '../../locales'
import { trackComponentAndMode } from '../../Tracker'
import { isDesktop, addDeviceRelatedProperties } from '~utils'
import UploadError from './Error'
import { validateFileTypeAndSize } from '~utils/file'
import { randomId } from '~utils/string'
import theme from '../Theme/style.css'
import style from './style.css'
import PageTitle from '../PageTitle'
import Button from '../Button'
import CustomFileInput from '../CustomFileInput'

const UploadButton = ({ text }) => (
  <Button variants={['centered', 'primary', 'lg']}>
    {text}
  </Button>
)

class ImageQualityGuide extends Component<Props, State> {
  static defaultProps = {
    onUpload: () => {}
  }

  setError = (name) => this.setState({ error: { name } })

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
    const error = validateFileTypeAndSize(file)
    if (error) {
      this.setError(error)
    } else {
      this.createCapture(file)
      this.props.nextStep()
    }
  }

  render() {
    const { translate } = this.props
    const { error } = this.state
    const imgAltText = translate('image_quality_guide.img_alt_text')
    const buttonText = translate('image_quality_guide.next_step')
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
                aria-label={imgAltText}
                className={classNames(
                  style.documentExampleImg,
                  style.documentExampleImgCutoff
                )}
              />
              <div
                className={style.documentExampleLabel}
                data-onfido-qa="documentExampleLabelCutoff">
                {translate('image_quality_guide.not_cut_off')}
              </div>
            </div>
            <div className={style.documentExampleCol}>
              <div
                role="img"
                aria-label={imgAltText}
                className={classNames(
                  style.documentExampleImg,
                  style.documentExampleImgBlur
                )}
              />
              <div
                className={style.documentExampleLabel}
                data-onfido-qa="documentExampleLabelBlur"
              >
                {translate('image_quality_guide.no_blur')}
              </div>
            </div>
          </div>
          <div className={style.imageQualityGuideRow}>
            <div className={style.documentExampleCol}>
              <div
                role="img"
                aria-label={imgAltText}
                className={classNames(
                  style.documentExampleImg,
                  style.documentExampleImgGlare
                )}
              />
              <div
                className={style.documentExampleLabel}
                data-onfido-qa="documentExampleLabelGlare">
                {translate('image_quality_guide.no_glare')}
              </div>
            </div>
            <div className={style.documentExampleCol}>
              <div
                role="img"
                aria-label={imgAltText}
                className={classNames(
                  style.documentExampleImg,
                  style.documentExampleImgGood
                )}
              />
              <div
                className={style.documentExampleLabel}
                data-onfido-qa="documentExampleLabelGood">
                {translate('image_quality_guide.all_good')}
              </div>
            </div>
          </div>
          {isDesktop ? (
            <CustomFileInput
              className={classNames(
                style.desktopUpload,
                style.passportUploadContainer
              )}
              onChange={this.handleFileSelected}
            >
              <UploadButton text={buttonText} />
            </CustomFileInput>
          ) : (
            <CustomFileInput
              className={style.buttonContainer}
              onChange={this.handleFileSelected}
              accept="image/*"
              capture
            >
              <UploadButton text={buttonText} />
            </CustomFileInput>
          )}
          {error && <UploadError {...{ error, translate }} />}
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
