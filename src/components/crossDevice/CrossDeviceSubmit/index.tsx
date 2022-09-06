import { h, Component, FunctionComponent, ComponentType } from 'preact'
import { connect } from 'react-redux'
import { Button } from '@onfido/castor-react'
import classNames from 'classnames'
import { trackComponent } from '../../../Tracker'
import PageTitle from '../../PageTitle'
import { localised } from '~locales'
import theme from '../../Theme/style.scss'
import style from './style.scss'
import { WithLocalisedProps, WithTrackingProps } from '~types/hocs'
import { CaptureState, RootState } from '~types/redux'
import { StepsRouterProps } from '~types/routers'
import { StepConfig } from '~types/steps'
import { MobileConfig } from '~types/commons'
import ScreenLayout from 'components/Theme/ScreenLayout'

type CrossDeviceSubmitProps = {
  captures: CaptureState
  steps: StepConfig[]
  nextStep: StepsRouterProps['nextStep']
  mobileConfig: MobileConfig
}

type Props = CrossDeviceSubmitProps & WithLocalisedProps & WithTrackingProps

type State = {
  isSubmitDisabled: boolean
}

class CrossDeviceSubmit extends Component<Props, State> {
  constructor() {
    super()
    this.state = {
      isSubmitDisabled: false,
    }
  }

  hasDocumentCaptureStep = () => {
    return (
      this.props.steps.some((step) => step.type === 'document') ||
      this.props.mobileConfig.steps[0].type === 'document'
    )
  }

  hasPoACaptureSteps = () => {
    return this.props.steps.some((step) => step.type === 'poa')
  }

  hasMultipleDocuments = () => {
    const { steps } = this.props
    const documentSteps = steps.filter((step) => step.type === 'document')
    return documentSteps.length > 1
  }

  hasFaceCaptureStep = () => {
    return (
      this.props.steps.some((step) => step.type === 'face') ||
      this.props.mobileConfig.steps[0].type === 'face'
    )
  }

  hasActiveVideoCaptureStep = () => {
    return (
      this.props.steps.some((step) => step.type === 'activeVideo') ||
      this.props.mobileConfig.steps[0].type === 'activeVideo'
    )
  }
  getFaceCaptureVariant = () => {
    const { face } = this.props.captures
    return face && face.metadata ? face.metadata.variant : 'standard'
  }

  handleSubmitButtonClick = () => {
    this.setState({ isSubmitDisabled: true })
    this.props.nextStep()
  }

  render() {
    const { translate } = this.props

    const documentCopy = this.hasMultipleDocuments()
      ? 'cross_device_checklist.list_item_doc_multiple'
      : 'cross_device_checklist.list_item_doc_one'

    const faceCaptureVariant =
      this.getFaceCaptureVariant() === 'standard' ? 'selfie' : 'video'

    const selfieCopy =
      faceCaptureVariant === 'video'
        ? 'cross_device_checklist.list_item_video'
        : 'cross_device_checklist.list_item_selfie'

    const activeVideoCopy = 'cross_device_checklist.list_item_active_video'

    // FIX: PoA copy currently only has English copy, need to update copy in other languages
    const poaCopy = 'cross_device_checklist.list_item_poa'

    const actions = (
      <Button
        type="button"
        variant="primary"
        className={classNames(theme['button-centered'], theme['button-lg'])}
        onClick={this.handleSubmitButtonClick}
        disabled={this.state.isSubmitDisabled}
        data-onfido-qa="cross-device-submit-btn"
      >
        {translate('cross_device_checklist.button_primary')}
      </Button>
    )

    return (
      <ScreenLayout pageId="CrossDeviceSubmit" actions={actions}>
        <PageTitle
          title={translate('cross_device_checklist.title')}
          subTitle={translate('cross_device_checklist.subtitle')}
        />
        <ul
          className={style.uploadList}
          aria-label={translate('cross_device_checklist.info')}
        >
          {this.hasPoACaptureSteps() && (
            <li className={style.uploadListItem}>
              <span className={`${theme.icon} ${style.icon}`} />
              <span
                className={classNames(
                  style.listText,
                  style.documentUploadedLabel
                )}
              >
                {translate(poaCopy)}
              </span>
            </li>
          )}
          {this.hasDocumentCaptureStep() && (
            <li className={style.uploadListItem}>
              <span className={`${theme.icon} ${style.icon}`} />
              <span
                className={classNames(
                  style.listText,
                  style.documentUploadedLabel
                )}
              >
                {translate(documentCopy)}
              </span>
            </li>
          )}
          {this.hasFaceCaptureStep() && (
            <li className={style.uploadListItem}>
              <span className={`${theme.icon} ${style.icon}`} />
              <span
                className={classNames(
                  style.listText,
                  style[`${faceCaptureVariant}UploadedLabel`]
                )}
              >
                {translate(selfieCopy)}
              </span>
            </li>
          )}
          {this.hasActiveVideoCaptureStep() && (
            <li className={style.uploadListItem}>
              <span className={`${theme.icon} ${style.icon}`} />
              <span
                className={classNames(
                  style.listText,
                  style.activeVideoUploadedLabel
                )}
              >
                {translate(activeVideoCopy)}
              </span>
            </li>
          )}
        </ul>
      </ScreenLayout>
    )
  }
}

const mapStateToProps = ({ captures }: RootState) => ({
  captures,
})

const LocalisedCrossDeviceSubmit = localised(
  CrossDeviceSubmit
) as FunctionComponent<Props>

const TrackedLocalisedCrossDeviceSubmit = trackComponent(
  LocalisedCrossDeviceSubmit,
  'desktop_submit'
) as FunctionComponent<Props>

// Note: Preact and Redux types don't play nice together, hence the type cast.
export default (connect(mapStateToProps)(
  TrackedLocalisedCrossDeviceSubmit
) as unknown) as ComponentType<CrossDeviceSubmitProps>
