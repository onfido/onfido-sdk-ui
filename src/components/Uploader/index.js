import { h, Component } from 'preact'
import classNames from 'classnames'
import { isDesktop } from '~utils'
import { camelCase } from '~utils/string'
import { validateFileTypeAndSize } from '~utils/file'
import { trackComponentAndMode } from '../../Tracker'
import { localised } from '../../locales'
import CustomFileInput from '../CustomFileInput'
import PageTitle from '../PageTitle'
import Button from '../Button'
import UploadError from './Error'
import theme from '../Theme/style.scss'
import style from './style.scss'

const MobileUploadArea = ({ onFileSelected, children, isPoA, translate }) => (
  <div className={style.uploadArea}>
    {children}
    <div className={classNames(style.buttons, { [style.poaButtons]: isPoA })}>
      <CustomFileInput
        className={classNames({
          [style.buttonContainer]: !isPoA,
          [style.poaBtnContainer]: isPoA,
        })}
        onChange={onFileSelected}
        accept="image/*"
        capture
      >
        <Button
          variants={isPoA ? ['secondary', 'sm'] : ['centered', 'primary', 'lg']}
        >
          {translate('photo_upload.button_take_photo')}
        </Button>
      </CustomFileInput>
      {isPoA && (
        <CustomFileInput onChange={onFileSelected}>
          <Button variants={['primary', 'sm']}>
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

const PassportMobileUploadArea = ({ nextStep, children, translate }) => (
  <div className={style.uploadArea}>
    {children}
    <div className={style.buttons}>
      <Button variants={['centered', 'primary', 'lg']} onClick={nextStep}>
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
          variants={['centered', 'primary', 'lg']}
          className={style.crossDeviceButton}
          onClick={() => changeFlowTo('crossDeviceSteps')}
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
  } = props
  const isPoA = uploadType === 'proof_of_address'

  if (isDesktop) {
    return (
      <DesktopUploadArea
        translate={translate}
        uploadType={uploadType}
        changeFlowTo={changeFlowTo}
        mobileFlow={mobileFlow}
      >
        <CustomFileInput onChange={handleFileSelected}>
          {error && <UploadError {...{ error, translate }} />}
          <button
            type="button"
            className={theme.link}
            data-onfido-qa="uploaderButtonLink"
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
      {...{ isPoA }}
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

  setError = (name) => this.setState({ error: { name } })

  handleFileSelected = (file) => {
    const error = validateFileTypeAndSize(file)
    return error ? this.setError(error) : this.props.onUpload(file)
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
              error={this.state.error}
              handleFileSelected={this.handleFileSelected}
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

export { UploadError, validateFileTypeAndSize }
