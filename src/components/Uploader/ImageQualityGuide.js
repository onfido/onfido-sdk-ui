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
  <Button variants={['centered', 'primary', 'lg']} className={style.passportUploadBtn}>
    {text}
  </Button>
)

const DocumentExample = ({ translate, exampleType, exampleLabelKey }) => (
  <div className={style.documentExampleCol}>
    <div
      role="img"
      aria-label={translate('image_quality_guide.img_alt_text')}
      className={classNames(
        style.documentExampleImg,
        style[`documentExampleImg${exampleType}`]
      )}
    />
    <div
      className={style.documentExampleLabel}
      data-onfido-qa={`documentExampleLabel${exampleType}`}>
      {translate(exampleLabelKey)}
    </div>
  </div>
)

const LocalisedDocumentExample = localised(DocumentExample)

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
    const buttonText = translate('image_quality_guide.next_step')
    return (
      <div className={theme.fullHeightContainer}>
        <PageTitle
          title={translate('image_quality_guide.title')}
          subTitle={translate('image_quality_guide.sub_title')}
        />
        <div className={classNames(theme.thickWrapper, style.imageQualityGuide)}>
          <div className={style.imageQualityGuideRow}>
            <LocalisedDocumentExample
              exampleType="Cutoff"
              exampleLabelKey="image_quality_guide.not_cut_off"
            />
            <LocalisedDocumentExample
              exampleType="Blur"
              exampleLabelKey="image_quality_guide.no_blur"
            />
          </div>
          <div className={style.imageQualityGuideRow}>
            <LocalisedDocumentExample
              exampleType="Glare"
              exampleLabelKey="image_quality_guide.no_glare"
            />
            <LocalisedDocumentExample
              exampleType="Good"
              exampleLabelKey="image_quality_guide.all_good"
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
