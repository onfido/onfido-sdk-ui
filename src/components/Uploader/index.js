import { h, Component } from 'preact'
import classNames from 'classnames'
import { isDesktop } from '~utils'
import { camelCase } from '~utils/string'
import { validateFileTypeAndSize } from '~utils/file'
import { trackComponentAndMode } from '../../Tracker'
import { localised } from '../../locales'
import theme from '../Theme/style.css'
import style from './style.css'
import CustomFileInput from '../CustomFileInput'
import PageTitle from '../PageTitle'
import Button from '../Button'
import UploadError from './Error'

const MobileUploadArea = ({ onFileSelected, children, isPoA, translate }) =>
  <div className={classNames(style.uploadArea, style.uploadAreaMobile)}>
    { children }
    <div className={classNames(style.buttons, { [style.poaButtons]: isPoA } )}>
      <CustomFileInput
        className={classNames({[style.buttonContainer]: !isPoA, [style.poaBtnContainer]: isPoA })}
        onChange={onFileSelected}
        accept="image/*"
        capture
      >
        <Button
          variants={isPoA ? ['secondary', 'sm'] : ['centered','primary', 'lg']}
        >
          {translate('capture.take_photo')}
        </Button>
      </CustomFileInput>
      {
        isPoA &&
          <CustomFileInput onChange={onFileSelected}>
            <Button
              variants={['primary', 'sm']}
            >
              {translate(`capture.upload_${isDesktop ? 'file' : 'document'}`)}
            </Button>
          </CustomFileInput>
      }
    </div>
  </div>

const DesktopUploadArea = ({
  translate,
  onFileSelected,
  error,
  uploadIcon,
  changeFlowTo,
  mobileFlow,
}) => (
  <div className={style.crossDeviceInstructionsContainer}>
    <i className={classNames(theme.icon, style.icon, style[uploadIcon])} />
    <div>
      {!mobileFlow && ( // Hide for mobileFlow on desktop browser as `test` Node environment has restrictedXDevice set to false
        <Button
          variants={['centered', 'primary', 'lg']}
          className={ style.crossDeviceButton }
          onClick={() => changeFlowTo('crossDeviceSteps')}
        >
          {translate('capture.switch_device')}
        </Button>
      )}
      <CustomFileInput
        className={style.desktopUpload}
        onChange={onFileSelected}
      >
        {error && <UploadError {...{ error, translate }} />}
        <button
          type="button"
          className={theme.link}
          data-onfido-qa="uploaderButtonLink"
        >
          {translate('capture.upload_file')}
        </button>
      </CustomFileInput>
    </div>
  </div>
)

const PassportMobileUploadArea = ({ nextStep, children, translate }) =>
  <div className={classNames(style.uploadArea, style.uploadAreaMobile)}>
    { children }
    <div className={style.buttons}>
      <Button
        variants={['centered', 'primary']}
        onClick={nextStep}
      >
        {translate('capture.take_photo')}
      </Button>
    </div>
  </div>

const PassportDesktopUploadArea = ({
  translate,
  nextStep,
  changeFlowTo,
  mobileFlow,
  error
}) => (
  <div className={style.crossDeviceInstructionsContainer}>
    <i className={classNames(theme.icon, style.icon, style.identityIcon)} />
    <div>
      {!mobileFlow && ( // Hide for mobileFlow on desktop browser as `test` Node environment has restrictedXDevice set to false
        <Button
          variants={['centered', 'primary']}
          className={style.crossDeviceButton}
          onClick={() => changeFlowTo('crossDeviceSteps')}
        >
          {translate('capture.switch_device')}
        </Button>
      )}
      <button
        type="button"
        className={theme.link}
        data-onfido-qa="uploaderButtonLink"
        onClick={nextStep}
      >
        {translate('capture.upload_file')}
      </button>
      {error && <UploadError {...{ error, translate }} />}
    </div>
  </div>
)

class Uploader extends Component {
  static defaultProps = {
    onUpload: () => {}
  }

  setError = (name) => this.setState({ error: {name}})

  handleFileSelected = (file) => {
    const error = validateFileTypeAndSize(file)
    return error ? this.setError(error) : this.props.onUpload(file)
  }

  renderPassportUploadArea() {
    const {
      changeFlowTo,
      uploadType,
      instructions,
      translate,
      mobileFlow,
      nextStep
    } = this.props
    const { error } = this.state
    if (isDesktop) {
      return (
        <PassportDesktopUploadArea
          nextStep={this.props.nextStep}
          changeFlowTo={changeFlowTo}
          uploadIcon={`${camelCase(uploadType)}Icon`}
          error={error}
          translate={translate}
          mobileFlow={mobileFlow}
        />
      )
    }
    return (
      <PassportMobileUploadArea nextStep={nextStep} translate={translate}>
        <div className={style.instructions}>
          <span className={classNames(theme.icon, style.icon, style.identityIcon)} />
          {error ? (
            <UploadError {...{ error, translate }} />
          ) : (
            <div className={style.instructionsCopy}>{instructions}</div>
          )}
        </div>
      </PassportMobileUploadArea>
    )
  }

  renderUploadArea() {
    const {
      changeFlowTo,
      uploadType,
      instructions,
      translate,
      mobileFlow
    } = this.props
    const isPoA = uploadType === 'proof_of_address'
    const { error } = this.state
    if (isDesktop) {
      return (
        <DesktopUploadArea
          onFileSelected={ this.handleFileSelected }
          changeFlowTo={ changeFlowTo }
          uploadIcon={ `${camelCase(uploadType)}Icon` }
          error={error}
          translate={translate}
          mobileFlow={mobileFlow} />
      )
    }
    return (
      <MobileUploadArea
        onFileSelected={this.handleFileSelected}
        translate={translate}
        {...{ isPoA }}
      >
        <div className={style.instructions}>
          <span
            className={classNames(
              theme.icon,
              style.icon,
              style[`${camelCase(uploadType)}Icon`]
            )}
          />
          {error ? (
            <UploadError {...{ error, translate }} />
          ) : (
            <div className={style.instructionsCopy}>{instructions}</div>
          )}
        </div>
      </MobileUploadArea>
    )
  }

  render() {
    const {
      title,
      subTitle,
      allowCrossDeviceFlow,
      translate,
      documentType,
      uploadType
    } = this.props
    const isPassportUpload = uploadType !== "face" && documentType === 'passport'
    return (
      <div className={classNames(theme.fullHeightContainer, style.container)}>
        <PageTitle
          title={title}
          subTitle={
            allowCrossDeviceFlow ?
              translate('cross_device.switch_device.header') :
              subTitle
          }
        />
        <div
          className={classNames(style.uploaderWrapper, {
            [style.crossDeviceClient]: !allowCrossDeviceFlow,
          })}
        >
          {isPassportUpload ?
            this.renderPassportUploadArea() :
            this.renderUploadArea()}
        </div>
      </div>
    )
  }
}

export default trackComponentAndMode(localised(Uploader), 'file_upload', 'error')

export {
  UploadError,
  validateFileTypeAndSize
}
