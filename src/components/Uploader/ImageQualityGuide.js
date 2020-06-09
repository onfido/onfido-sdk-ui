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

const UploadButton = localised(({ translate }) => (
  <Button variants={['centered', 'primary', 'lg']} className={style.passportUploadBtn}>
    {translate('image_quality_guide.next_step')}
  </Button>
))

const DocumentExample = localised(({ translate, type, label }) => (
  <div className={style.documentExampleCol}>
    <div
      role="img"
      aria-label={translate('image_quality_guide.image_alt_text')}
      className={classNames(
        style.documentExampleImg,
        style[`documentExampleImg${type}`]
      )}
    />
    <div
      className={style.documentExampleLabel}
      data-onfido-qa={`documentExampleLabel${type}`}>
      {translate(label)}
    </div>
  </div>
))

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
    return (
      <div className={theme.fullHeightContainer}>
        <PageTitle
          title={translate('image_quality_guide.title')}
          subTitle={translate('image_quality_guide.sub_title')}
        />
        <div className={classNames(theme.thickWrapper, style.imageQualityGuide)}>
          <div className={style.imageQualityGuideRow}>
            <DocumentExample
              type="Cutoff"
              label="image_quality_guide.not_cut_off"
            />
            <DocumentExample
              type="Blur"
              label="image_quality_guide.no_blur"
            />
          </div>
          <div className={style.imageQualityGuideRow}>
            <DocumentExample
              type="Glare"
              label="image_quality_guide.no_glare"
            />
            <DocumentExample
              type="Good"
              label="image_quality_guide.all_good"
            />
          </div>
        </div>
        <div className={theme.thickWrapper}>
          {isDesktop ? (
            <CustomFileInput
              className={classNames(
                style.desktopUpload,
                style.passportUploadContainer
              )}
              onChange={this.handleFileSelected}
            >
              <UploadButton />
            </CustomFileInput>
          ) : (
            <CustomFileInput
              className={style.buttonContainer}
              onChange={this.handleFileSelected}
              accept="image/*"
              capture
            >
              <UploadButton />
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
