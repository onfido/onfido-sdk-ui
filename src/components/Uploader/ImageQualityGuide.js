import { h, Component } from 'preact'
import classNames from 'classnames'
import { localised } from '../../locales'
import { trackComponentAndMode } from '../../Tracker'
import { isDesktop, addDeviceRelatedProperties } from '~utils'
import UploadError from './Error'
import { validateFileTypeAndSize } from '~utils/file'
import { randomId } from '~utils/string'
import PageTitle from '../PageTitle'
import Button from '../Button'
import CustomFileInput from '../CustomFileInput'
import theme from '../Theme/style.scss'
import style from './style.scss'

const UploadButton = localised(({ translate }) => (
  <Button variants={['centered', 'primary', 'lg']}>
    {translate('image_quality_guide.next_step')}
  </Button>
))

const DocumentExample = localised(({ translate, type }) => {
  const baseStringKey = 'image_quality_guide'
  const classByType = {
    not_cut_off: 'Cutoff',
    no_blur: 'Blur',
    no_glare: 'Glare',
    all_good: 'Good',
  }
  return (
    <div className={style.documentExampleCol}>
      <div
        role="img"
        aria-label={translate(`${baseStringKey}.${type}.image_alt_text`)}
        className={classNames(
          style.documentExampleImg,
          style[`documentExampleImg${classByType[type]}`]
        )}
      />
      <div
        className={style.documentExampleLabel}
        data-onfido-qa={`documentExampleLabel${classByType[type]}`}
      >
        {translate(`${baseStringKey}.${type}.label`)}
      </div>
    </div>
  )
})

class ImageQualityGuide extends Component<Props, State> {
  static defaultProps = {
    onUpload: () => {},
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
        <div className={style.contentWrapper}>
          <div className={theme.scrollableContent}>
            <div className={style.imageQualityGuideRow}>
              <DocumentExample type="not_cut_off" />
              <DocumentExample type="no_blur" />
            </div>
            <div className={style.imageQualityGuideRow}>
              <DocumentExample type="no_glare" />
              <DocumentExample type="all_good" />
            </div>
          </div>
          <div>
            {error && <UploadError {...{ error, translate }} />}
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
                className={classNames(
                  style.buttonContainer,
                  style.passportButtonContainer
                )}
                onChange={this.handleFileSelected}
                accept="image/*"
                capture
              >
                <UploadButton />
              </CustomFileInput>
            )}
          </div>
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
