import { Component, ComponentChildren, h } from 'preact'
import { Button } from '@onfido/castor-react'
import classNames from 'classnames'
import { isDesktop } from '~utils'
import { camelCase } from '~utils/string'
import { validateFile } from '~utils/file'
import { isButtonGroupStacked } from '../Theme/utils'
import { appendToTracking } from '../../Tracker'
import { localised } from '~locales'
import CustomFileInput from '../CustomFileInput'
import PageTitle from '../PageTitle'
import UploadError from './Error'
import theme from '../Theme/style.scss'
import style from './style.scss'
import { WithLocalisedProps, WithTrackingProps } from '~types/hocs'
import { ErrorProp, StepComponentBaseProps } from '~types/routers'
import { ErrorNames, ImageResizeInfo } from '~types/commons'
import { DocumentTypes } from '~types/steps'

type UploadType = 'proof_of_address' | 'face' | 'identity'
type OnUploadHandler = (blob: Blob, imageResizeInfo?: ImageResizeInfo) => void

type MobileUploadAreaProps = {
  captureType: 'environment' | 'user'
  children: ComponentChildren
  isPoA: boolean
  isUploading: boolean
  onFileSelected: OnUploadHandler
  pageId?: string
} & Pick<WithLocalisedProps, 'translate'>

type PassportMobileUploadAreaProps = {
  children: ComponentChildren
  isUploading?: boolean
  pageId: string
} & Pick<WithLocalisedProps, 'translate'> &
  Pick<StepComponentBaseProps, 'nextStep'>

type DesktopUploadAreaProps = {
  children: ComponentChildren
  isUploading?: boolean
  mobileFlow?: boolean
  uploadType: UploadType
} & Pick<WithLocalisedProps, 'translate'> &
  Pick<StepComponentBaseProps, 'changeFlowTo'>

type PassportUploadIntroProps = {
  instructions: string
  mobileFlow?: boolean
  uploadType: UploadType
} & Pick<WithLocalisedProps, 'translate'> &
  Pick<StepComponentBaseProps, 'nextStep' | 'changeFlowTo'>

type UploadAreaProps = {
  captureType: 'environment' | 'user'
  error?: ErrorProp
  handleFileSelected: OnUploadHandler
  instructions: string
  isUploading: boolean
  mobileFlow?: boolean
  uploadType: UploadType
} & WithLocalisedProps &
  StepComponentBaseProps &
  WithTrackingProps

type UploaderProps = {
  allowCrossDeviceFlow: boolean
  documentType?: DocumentTypes
  instructions: string
  onUpload: OnUploadHandler
  pageId: string
  subTitle?: string
  title: string
  uploadType: UploadType
  countryCode?: string
} & WithLocalisedProps &
  StepComponentBaseProps &
  WithTrackingProps

type UploaderState = {
  error?: ErrorProp
  isUploading: boolean
}

const MobileUploadArea = ({
  onFileSelected,
  children,
  isPoA,
  translate,
  isUploading,
  captureType,
  pageId,
}: MobileUploadAreaProps) => (
  <div className={style.uploadArea} data-page-id={pageId}>
    {children}
    <div
      className={classNames(style.buttons, {
        [style.poaButtons]: isPoA,
        [style.vertical]: isButtonGroupStacked(),
      })}
    >
      <CustomFileInput
        className={classNames({
          [style.buttonContainer]: !isPoA,
          [style.poaBtn]: isPoA,
          [style.vertical]: isButtonGroupStacked(),
        })}
        onChange={onFileSelected}
        accept="image/*"
        capture={captureType}
      >
        <Button
          type="button"
          variant={isPoA ? 'secondary' : 'primary'}
          className={
            isPoA
              ? classNames(theme['button-sm'], {
                  [theme.vertical]: isButtonGroupStacked(),
                })
              : classNames(theme['button-centered'], theme['button-lg'])
          }
          disabled={isUploading}
        >
          {translate('photo_upload.button_take_photo')}
        </Button>
      </CustomFileInput>
      {isPoA && (
        <CustomFileInput
          onChange={onFileSelected}
          className={classNames({ [style.poaBtn]: isPoA })}
        >
          <Button
            type="button"
            variant="primary"
            className={classNames(theme['button-sm'], {
              [theme.vertical]: isButtonGroupStacked(),
            })}
            disabled={isUploading}
          >
            {translate(
              isDesktop
                ? 'doc_submit.button_link_upload'
                : 'photo_upload.button_upload'
            )}
          </Button>
        </CustomFileInput>
      )}
    </div>
  </div>
)

const PassportMobileUploadArea = ({
  nextStep,
  children,
  translate,
  isUploading,
  pageId,
}: PassportMobileUploadAreaProps) => (
  <div className={style.uploadArea} data-page-id={pageId}>
    {children}
    <div className={style.buttons}>
      <Button
        type="button"
        variant="primary"
        className={classNames(theme['button-centered'], theme['button-lg'])}
        disabled={isUploading}
        onClick={nextStep}
      >
        {translate('photo_upload.button_take_photo')}
      </Button>
    </div>
  </div>
)

const DesktopUploadArea = ({
  translate,
  uploadType,
  changeFlowTo,
  mobileFlow,
  children,
  isUploading,
}: DesktopUploadAreaProps) => (
  <div className={style.crossDeviceInstructionsContainer}>
    <div className={classNames(theme.iconContainer, style.iconContainer)}>
      <i
        className={classNames(
          theme.icon,
          style.icon,
          style[`${camelCase(uploadType)}Icon`]
        )}
      />
    </div>
    <div>
      {!mobileFlow && ( // Hide for mobileFlow on desktop browser as `test` Node environment has restrictedXDevice set to false
        <Button
          type="button"
          variant="primary"
          className={classNames(
            theme['button-centered'],
            theme['button-lg'],
            style.crossDeviceButton
          )}
          onClick={() => changeFlowTo('crossDeviceSteps')}
          disabled={isUploading}
        >
          {translate('doc_submit.button_primary')}
        </Button>
      )}
      {children}
    </div>
  </div>
)

const PassportUploadIntro = ({
  changeFlowTo,
  uploadType,
  instructions,
  translate,
  mobileFlow,
  nextStep,
}: PassportUploadIntroProps) => {
  if (isDesktop) {
    return (
      <DesktopUploadArea
        translate={translate}
        uploadType={uploadType}
        changeFlowTo={changeFlowTo}
        mobileFlow={mobileFlow}
      >
        <button
          type="button"
          className={classNames(theme.link, style.buttonLinkUploadCopy)}
          data-onfido-qa="uploaderButtonLink"
          onClick={nextStep}
        >
          {translate('doc_submit.button_link_upload')}
        </button>
      </DesktopUploadArea>
    )
  }
  return (
    <PassportMobileUploadArea
      nextStep={nextStep}
      translate={translate}
      pageId={'PassportUploadIntro'}
    >
      <div className={style.instructions}>
        <div className={classNames(theme.iconContainer, style.iconContainer)}>
          <span className={classNames(theme.icon, style.identityIcon)} />
        </div>
        <div className={style.instructionsCopy}>{instructions}</div>
      </div>
    </PassportMobileUploadArea>
  )
}

const UploadArea = (props: UploadAreaProps) => {
  const {
    changeFlowTo,
    uploadType,
    instructions,
    translate,
    mobileFlow,
    error,
    handleFileSelected,
    isUploading,
    captureType,
    trackScreen,
  } = props
  const isPoA = uploadType === 'proof_of_address'

  if (isDesktop) {
    return (
      <DesktopUploadArea
        translate={translate}
        uploadType={uploadType}
        changeFlowTo={changeFlowTo}
        mobileFlow={mobileFlow}
        isUploading={isUploading}
      >
        <CustomFileInput onChange={handleFileSelected}>
          {error && <UploadError {...{ error, trackScreen, translate }} />}
          <button
            type="button"
            className={classNames(theme.link, style.buttonLinkUploadCopy)}
            data-onfido-qa="uploaderButtonLink"
            disabled={isUploading}
          >
            {translate('doc_submit.button_link_upload')}
          </button>
        </CustomFileInput>
      </DesktopUploadArea>
    )
  }

  return (
    <MobileUploadArea
      onFileSelected={handleFileSelected}
      translate={translate}
      isPoA={isPoA}
      isUploading={isUploading}
      captureType={captureType}
    >
      <div className={style.instructions}>
        <div
          className={classNames(theme.iconContainer, style.iconContainer, {
            [style.poaIconContainer]: isPoA,
          })}
        >
          <span
            className={classNames(
              theme.icon,
              style.icon,
              style[`${camelCase(uploadType)}Icon`]
            )}
          />
        </div>
        {error ? (
          <UploadError {...{ error, trackScreen, translate }} />
        ) : (
          <div className={style.instructionsCopy}>{instructions}</div>
        )}
      </div>
    </MobileUploadArea>
  )
}

class Uploader extends Component<UploaderProps, UploaderState> {
  static defaultProps = {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onUpload: () => {},
  }

  componentDidMount = () => {
    const { countryCode } = this.props
    this.props.trackScreen(
      undefined,
      countryCode ? { country_code: countryCode } : undefined
    )
  }

  setError = (name: ErrorNames) =>
    this.setState({ error: { name }, isUploading: false })

  handleFileSelected = (file: Blob) => {
    this.setState({
      error: undefined,
      isUploading: true,
    })
    validateFile(file, this.props.onUpload, this.setError)
  }

  render() {
    const {
      title,
      subTitle,
      allowCrossDeviceFlow,
      translate,
      documentType,
      uploadType,
      pageId,
      trackScreen,
      currentStepType,
    } = this.props

    const isPassportUpload =
      uploadType !== 'face' &&
      documentType === 'passport' &&
      currentStepType !== 'poa'

    const captureType = uploadType === 'face' ? 'user' : 'environment'

    return (
      <div
        className={classNames(theme.fullHeightContainer, style.container)}
        data-page-id={pageId}
      >
        <PageTitle
          title={title}
          subTitle={
            allowCrossDeviceFlow ? translate('doc_submit.subtitle') : subTitle
          }
        />
        <div
          className={classNames(style.uploaderWrapper, {
            [style.crossDeviceClient]: !allowCrossDeviceFlow,
          })}
        >
          {isPassportUpload ? (
            <PassportUploadIntro {...this.props} />
          ) : (
            <UploadArea
              {...this.props}
              captureType={captureType}
              error={this.state.error}
              trackScreen={trackScreen}
              handleFileSelected={this.handleFileSelected}
              isUploading={this.state.isUploading}
            />
          )}
        </div>
      </div>
    )
  }
}

export default appendToTracking(localised(Uploader), 'file_upload')
