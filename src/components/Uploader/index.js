import { h, Component } from 'preact'
import { Button } from '@onfido/castor-react'
import classNames from 'classnames'
import { isDesktop } from '~utils'
import { camelCase } from '~utils/string'
import { validateFile } from '~utils/file'
import { isButtonGroupStacked } from '../Theme/utils'
import { trackComponentAndMode } from '../../Tracker'
import { localised } from '../../locales'
import CustomFileInput from '../CustomFileInput'
import PageTitle from '../PageTitle'
import UploadError from './Error'
import theme from '../Theme/style.scss'
import style from './style.scss'

const MobileUploadArea = ({
  onFileSelected,
  children,
  isPoA,
  translate,
  isUploading,
  captureType,
}) => (
  <div className={style.uploadArea}>
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
}) => (
  <div className={style.uploadArea}>
    {children}
    <div className={style.buttons}>
      <Button
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
}) => (
  <div className={style.crossDeviceInstructionsContainer}>
    <div className={style.iconContainer}>
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
}) => {
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
          className={theme.link}
          data-onfido-qa="uploaderButtonLink"
          onClick={nextStep}
        >
          {translate('doc_submit.button_link_upload')}
        </button>
      </DesktopUploadArea>
    )
  }
  return (
    <PassportMobileUploadArea nextStep={nextStep} translate={translate}>
      <div className={style.instructions}>
        <div className={style.iconContainer}>
          <span className={classNames(theme.icon, style.identityIcon)} />
        </div>
        <div className={style.instructionsCopy}>{instructions}</div>
      </div>
    </PassportMobileUploadArea>
  )
}

const UploadArea = (props) => {
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
          {error && <UploadError {...{ error, translate }} />}
          <button
            type="button"
            className={theme.link}
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
      {...{ isPoA, isUploading, captureType }}
    >
      <div className={style.instructions}>
        <div
          className={classNames(style.iconContainer, {
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
          <UploadError {...{ error, translate }} />
        ) : (
          <div className={style.instructionsCopy}>{instructions}</div>
        )}
      </div>
    </MobileUploadArea>
  )
}

class Uploader extends Component {
  static defaultProps = {
    onUpload: () => {},
  }

  state = {
    error: null,
    isUploading: false,
  }

  setError = (name) => this.setState({ error: { name }, isUploading: false })

  handleFileSelected = (file) => {
    this.setState({
      error: null,
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
    } = this.props
    const isPassportUpload =
      uploadType !== 'face' && documentType === 'passport'
    const captureType = uploadType === 'face' ? 'user' : 'environment'
    return (
      <div className={classNames(theme.fullHeightContainer, style.container)}>
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
              handleFileSelected={this.handleFileSelected}
              isUploading={this.state.isUploading}
            />
          )}
        </div>
      </div>
    )
  }
}

export default trackComponentAndMode(
  localised(Uploader),
  'file_upload',
  'error'
)
