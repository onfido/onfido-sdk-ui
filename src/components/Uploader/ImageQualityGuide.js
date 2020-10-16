import { h, Component } from 'preact'
import classNames from 'classnames'
import { localised } from '../../locales'
import { trackComponentAndMode } from '../../Tracker'
import { isDesktop, addDeviceRelatedProperties, capitalise } from '~utils'
import UploadError from './Error'
import { validateFileTypeAndSize } from '~utils/file'
import { IMAGE_QUALITY_GUIDE_LOCALES_MAPPING } from '~utils/localesMapping'
import { randomId } from '~utils/string'
import PageTitle from '../PageTitle'
import Button from '../Button'
import CustomFileInput from '../CustomFileInput'
import theme from '../Theme/style.scss'
import style from './style.scss'

const UploadButton = localised(({ translate }) => (
  <Button variants={['centered', 'primary', 'lg']}>
    {translate('upload_guide.button_primary')}
  </Button>
))

const DocumentExample = localised(({ translate, type }) => (
  <div className={style.documentExampleCol}>
    {/* FIXME Unable to use an <img alt="" /> element as expected with image path as source,
              can only be done as background image on stylesheets (ticket to fix CX-5267) */}
    <div
      role="presentation"
      className={classNames(
        style.documentExampleImg,
        style[`documentExampleImg${capitalise(type)}`]
      )}
    />
    <div
      role="listitem"
      className={style.documentExampleLabel}
      data-onfido-qa={`documentExampleLabel${capitalise(type)}`}
    >
      {translate(IMAGE_QUALITY_GUIDE_LOCALES_MAPPING[type].label)}
    </div>
  </div>
))

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
          title={translate('upload_guide.title')}
          subTitle={translate('upload_guide.subtitle')}
        />
        <div className={style.contentWrapper}>
          <div role="list" className={theme.scrollableContent}>
            <div className={style.imageQualityGuideRow}>
              <DocumentExample type="cutoff" />
              <DocumentExample type="blur" />
            </div>
            <div className={style.imageQualityGuideRow}>
              <DocumentExample type="glare" />
              <DocumentExample type="good" />
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
                className={style.buttonContainer}
                onChange={this.handleFileSelected}
                accept="image/*"
                capture
              >
                <span className={style.passportButtonShadow} />
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
