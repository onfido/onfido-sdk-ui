import { h, Component } from 'preact'
import { connect } from 'react-redux'
import { Button } from '@onfido/castor-react'
import classNames from 'classnames'
import { trackComponent } from '../../../Tracker'
import PageTitle from '../../PageTitle'
import { localised } from '~locales'
import theme from '../../Theme/style.scss'
import style from './style.scss'
import { WithLocalisedProps, WithTrackingProps } from '~types/hocs'
import { StepsRouterProps } from '~types/routers'
import { StepConfig } from '~types/steps'
import { CaptureState } from '~types/redux'

type CrossDeviceSubmitProps = {
  captures: CaptureState
  steps: StepConfig[]
  nextStep: StepsRouterProps['nextStep']
}

type Props = CrossDeviceSubmitProps & WithLocalisedProps & WithTrackingProps

type State = {
  isSubmitDisabled: boolean
}

class CrossDeviceSubmit extends Component<Props, State> {
  state = {
    isSubmitDisabled: false,
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

  getFaceCaptureVariant = () => {
    const { captures } = this.props
    const { face } = captures
    return face && face?.metadata ? face?.metadata?.variant : 'standard'
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

    // FIX: PoA copy currently only has English copy, need to update copy in other languages
    const poaCopy = 'cross_device_checklist.list_item_poa'

    return (
      <div data-page-id={'CrossDeviceSubmit'}>
        <PageTitle
          title={translate('cross_device_checklist.title')}
          subTitle={translate('cross_device_checklist.subtitle')}
        />
        <div>
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
          </ul>

          <div>
            <Button
              type="button"
              variant="primary"
              className={classNames(
                theme['button-centered'],
                theme['button-lg']
              )}
              onClick={this.handleSubmitButtonClick}
              disabled={this.state.isSubmitDisabled}
              data-onfido-qa="cross-device-submit-btn"
            >
              {translate('cross_device_checklist.button_primary')}
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ captures }: { captures: CaptureState }) => ({
  captures,
})

export default connect(mapStateToProps)(
  // @ts-ignore
  trackComponent(localised(CrossDeviceSubmit), 'desktop_submit')
)
