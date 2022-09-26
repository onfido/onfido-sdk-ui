import { h, Component } from 'preact'
import { Button } from '@onfido/castor-react'
import classNames from 'classnames'
import { localised, useLocales } from '~locales'
import { trackComponent } from '../../Tracker'
import { addDeviceRelatedProperties, capitalise, isDesktop } from '~utils'
import UploadError from './Error'
import { ImageValidationTypes, validateFile } from '~utils/file'
import { IMAGE_QUALITY_GUIDE_LOCALES_MAPPING } from '~utils/localesMapping'
import { randomId } from '~utils/string'
import PageTitle from '../PageTitle'
import CustomFileInput from '../CustomFileInput'
import theme from '../Theme/style.scss'
import style from './style.scss'
import { ImageResizeInfo } from '~types/commons'
import { WithLocalisedProps } from '~types/hocs'
import { ErrorProp, StepComponentBaseProps } from '~types/routers'
import { CapturePayload } from '~types/redux'

type UploadButtonProps = {
  isUploading: boolean
}

type DocumentExampleProps = {
  type: string
}

type ImageQualityGuideProps = StepComponentBaseProps & WithLocalisedProps

type ImageQualityGuideState = {
  error?: ErrorProp
  isUploading: boolean
}

const UploadButton = ({ isUploading }: UploadButtonProps) => {
  const { translate } = useLocales()
  return (
    <Button
      type="button"
      variant="primary"
      className={classNames(theme['button-centered'], theme['button-lg'])}
      disabled={isUploading}
      data-onfido-qa="image-guide-doc-upload-btn"
    >
      {translate('upload_guide.button_primary')}
    </Button>
  )
}

const DocumentExample = ({ type }: DocumentExampleProps) => {
  const { translate } = useLocales()
  return (
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
        {
          //@ts-ignore
          translate(IMAGE_QUALITY_GUIDE_LOCALES_MAPPING[type].label)
        }
      </div>
    </div>
  )
}

class ImageQualityGuide extends Component<
  ImageQualityGuideProps,
  ImageQualityGuideState
> {
  state: ImageQualityGuideState = {
    isUploading: false,
  }

  setError = (name: ImageValidationTypes) =>
    this.setState({ error: { name }, isUploading: false })

  createCapture = (file: Blob, imageResizeInfo?: ImageResizeInfo) => {
    const payload: CapturePayload = {
      blob: file,
      sdkMetadata: { captureMethod: 'html5', imageResizeInfo },
    }
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

  handleFileSelected = (file: Blob) => {
    this.setState({
      error: undefined,
      isUploading: true,
    })
    validateFile(file, this.createCaptureDataForFile, this.setError)
  }

  createCaptureDataForFile = (
    blob: Blob,
    imageResizeInfo?: ImageResizeInfo
  ) => {
    this.createCapture(blob, imageResizeInfo)
    this.props.nextStep()
  }

  render() {
    const { translate, trackScreen } = this.props
    const { error, isUploading } = this.state

    return (
      <div
        className={theme.fullHeightContainer}
        data-page-id={'ImageQualityGuide'}
      >
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
            {error && <UploadError error={error} trackScreen={trackScreen} />}
            {isDesktop ? (
              <CustomFileInput
                className={classNames(
                  style.desktopUpload,
                  style.passportUploadContainer
                )}
                onChange={this.handleFileSelected}
              >
                <UploadButton isUploading={isUploading} />
              </CustomFileInput>
            ) : (
              <CustomFileInput
                className={style.buttonContainer}
                onChange={this.handleFileSelected}
                accept="image/*"
                capture="environment"
              >
                <span className={style.passportButtonShadow} />
                <UploadButton isUploading={isUploading} />
              </CustomFileInput>
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default trackComponent(
  localised(ImageQualityGuide),
  'image_quality_guide'
)
