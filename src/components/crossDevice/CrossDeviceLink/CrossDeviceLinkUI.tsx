import classNames from 'classnames'
import { Component, createRef, h } from 'preact'
import { sendEvent } from 'Tracker'
import { ParsedError } from '~types/api'
import { ErrorNames } from '~types/commons'
import { ErrorProp } from '~types/routers'
import { preventDefaultOnClick } from '~utils'
import { performHttpRequest } from '~core/Network'
import { formatError } from '~utils/onfidoApi'
import theme from '../../Theme/style.scss'
import style from './style.scss'
import { Button } from '@onfido/castor-react'
import PhoneNumberInputLazy from '../../PhoneNumberInput/Lazy'
import QRCodeGenerator from '../../QRCode'
import QRCodeHowTo from '../../QRCode/HowTo'
import Error from '../../Error'
import PageTitle from 'components/PageTitle'
import CopyLink from './CopyLink'
import { LegacyTrackedEventNames } from '~types/tracker'
import { CrossDeviceLinkProps } from '.'
import { Country } from 'react-phone-number-input'

export type SecureLinkViewType = {
  id: string
  className: string
  label: string
  subtitle: string
}[]

export const SECURE_LINK_VIEWS: SecureLinkViewType = [
  {
    id: 'qr_code',
    className: 'qrCodeLinkOption',
    label: 'get_link.link_qr',
    subtitle: 'get_link.subtitle_qr',
  },
  {
    id: 'sms',
    className: 'smsLinkOption',
    label: 'get_link.link_sms',
    subtitle: 'get_link.subtitle_sms',
  },
  {
    id: 'copy_link',
    className: 'copyLinkOption',
    label: 'get_link.link_url',
    subtitle: 'get_link.subtitle_url',
  },
]

export const configHasInvalidViewIds = (viewIdsInConfig: Array<string>) => {
  const validViewIds = new Set(SECURE_LINK_VIEWS.map(({ id }) => id))
  const invalidViewIds = viewIdsInConfig.filter(
    (viewId) => !validViewIds.has(viewId)
  )
  if (invalidViewIds.length > 0) {
    console.warn(
      'Default settings applied. Invalid properties in _crossDeviceLinkMethods option:',
      invalidViewIds.join(', ')
    )
    console.warn(
      '_crossDeviceLinkMethods must be an array with at least 1 of the following option: "qr_code", "copy_link", "sms"'
    )
    return true
  }
  return false
}

export const validatesViewIdWithFallback = (viewId: string) => {
  const validViewIds = SECURE_LINK_VIEWS.map(({ id }) => id)

  if (validViewIds.includes(viewId)) {
    return viewId
  }

  return 'qr_code'
}

type viewRendersMapType = Record<string, () => JSX.Element>
type CrossDeviceLinkUIProps = {
  _crossDeviceLinkMethods?: Array<string> | null
}

type Props = CrossDeviceLinkUIProps & CrossDeviceLinkProps

type State = {
  currentViewId: string
  validNumber: boolean
  sending: boolean
  error?: ErrorProp
}

class CrossDeviceLinkUI extends Component<Props, State> {
  private sendLinkClickTimeoutId?: NodeJS.Timeout = undefined
  private viewOptionBtn = createRef<HTMLAnchorElement>()

  constructor(props: Props) {
    super(props)

    const documentStep = props.steps.find(({ type }) => type === 'document')
    const restrictedCrossDeviceLinkMethods = props._crossDeviceLinkMethods || []
    const initialViewId =
      restrictedCrossDeviceLinkMethods[0] ||
      // @ts-ignore
      documentStep?.options?._initialCrossDeviceLinkView
    this.state = {
      currentViewId: validatesViewIdWithFallback(initialViewId),
      sending: false,
      error: undefined,
      validNumber: true,
    }
  }

  linkId = `${process.env.BASE_32_VERSION}${this.props.roomId}`

  setError = (name: ErrorNames) =>
    this.setState({ error: { name, type: 'error' } })

  clearErrors = () => {
    this.clearSendLinkClickTimeout()
    this.setState({
      error: undefined,
      validNumber: true,
    })
  }

  handleResponse = (response: { status: string }) => {
    this.clearSendLinkClickTimeout()
    this.setState({ sending: false })
    if (response.status === 'OK') {
      this.props.nextStep()
    } else {
      this.setError('SMS_FAILED')
    }
  }

  handleSMSError = (error: ParsedError) => {
    this.clearSendLinkClickTimeout()
    this.setState({ sending: false })
    this.props.triggerOnError(error)
    error.status === 429
      ? this.setError('SMS_OVERUSE')
      : this.setError('SMS_FAILED')
  }

  handleSendSmsLinkClick = () => {
    if (!this.props.sms.valid) {
      this.clearSendLinkClickTimeout()
      this.setState({ validNumber: false })
    } else if (!this.sendLinkClickTimeoutId) {
      this.sendLinkClickTimeoutId = setTimeout(this.sendSms, 500)
    }
  }

  sendSms = () => {
    this.setState({ sending: true })
    // add a quick note that this will send a production SMS, so non-production
    // environment users will need to amend any URLs that they receive.
    if (
      process.env.NODE_ENV === 'test' ||
      process.env.NODE_ENV === 'development'
    ) {
      alert(
        `An SMS will be sent, but the link in it will be to production, not to ${window.location.origin}`
      )
    }
    // On staging, inform devs that sms will not be sent and link must be copy-pasted
    if (process.env.NODE_ENV === 'staging') {
      alert(
        `No SMS will be sent, please copy this link ${window.location.origin}`
      )
    }

    const { language, sms, token, urls } = this.props
    const url = urls.telephony_url
    const options = {
      // TODO: change this to pass entire language string once telephony service supports language region
      payload: JSON.stringify({
        to: sms.number,
        id: this.linkId,
        language: language?.substring(0, 2),
      }),
      endpoint: `${url}/v1/cross_device_sms`,
      contentType: 'application/json',
      token: `Bearer ${token}`,
    }
    performHttpRequest(options, this.handleResponse, (request) =>
      formatError(request, this.handleSMSError)
    )
  }

  getMobileUrl = () => {
    const { hosted_sdk_url, cross_device_url } = this.props.urls
    const mobileUrl = cross_device_url || hosted_sdk_url
    // This lets us test the cross device flow locally and on Surge.
    // We use the same location to test the same bundle as the desktop flow.

    // TODO: review this change

    return process.env.MOBILE_URL === '/'
      ? `${window.location.origin}${window.location.pathname}?link_id=${this.linkId}`
      : `${mobileUrl}/${this.linkId}`
  }

  clearSendLinkClickTimeout() {
    if (this.sendLinkClickTimeoutId) {
      clearTimeout(this.sendLinkClickTimeoutId)
    }
  }

  renderSmsLinkSection = (): JSX.Element => {
    const { translate } = this.props
    const { sending, validNumber } = this.state
    const buttonCopyKey = sending
      ? 'get_link.loader_sending'
      : 'get_link.button_submit'
    const invalidNumber = !validNumber
    return (
      <div>
        <div className={style.smsSection}>
          <div className={style.label}>
            {translate('get_link.number_field_label')}
          </div>
          <div className={style.numberInputSection}>
            <div
              className={classNames(style.inputContainer, {
                [style.fieldError]: invalidNumber,
              })}
            >
              <PhoneNumberInputLazy
                {...this.props}
                smsNumberCountryCode={
                  this.props.smsNumberCountryCode as Country
                }
                options={this.props}
                clearErrors={this.clearErrors}
              />
            </div>
            <Button
              type="button"
              variant="primary"
              className={classNames(style.btn, { [style.sending]: sending })}
              onClick={this.handleSendSmsLinkClick}
              disabled={sending || invalidNumber}
              aria-busy={sending}
              aria-live="polite"
              aria-relevant="text"
              data-onfido-qa="cross-device-send-link-btn"
            >
              {translate(buttonCopyKey)}
            </Button>
          </div>
        </div>
        <div role="alert" hidden={!invalidNumber}>
          {invalidNumber && (
            <div className={style.numberError}>
              {translate('get_link.alert_wrong_number')}
            </div>
          )}
        </div>
      </div>
    )
  }

  renderCopyLinkSection = (): JSX.Element => (
    <CopyLink mobileUrl={this.getMobileUrl()} />
  )

  renderQrCodeSection = (): JSX.Element => (
    <div className={style.qrCodeSection}>
      <div
        className={style.qrCodeContainer}
        role="img"
        aria-label="QR code image"
      >
        <div className={style.qrCodeBackground}>
          <QRCodeGenerator url={this.getMobileUrl()} size={144} />
        </div>
      </div>
      <QRCodeHowTo />
    </div>
  )

  handleViewOptionSelect = (newViewId: string) => {
    sendEvent(
      `${newViewId.replace('_', ' ')} selected` as LegacyTrackedEventNames
    )
    this.setState({ currentViewId: newViewId })
    if (this.viewOptionBtn.current) {
      this.viewOptionBtn.current.blur()
    }
  }

  getRequiredViewRenders = (): viewRendersMapType => {
    const { _crossDeviceLinkMethods = [] } = this.props
    const defaultViewRendersMap: viewRendersMapType = {
      qr_code: this.renderQrCodeSection,
      sms: this.renderSmsLinkSection,
      copy_link: this.renderCopyLinkSection,
    }
    if (
      _crossDeviceLinkMethods === null ||
      _crossDeviceLinkMethods.length < 1 ||
      configHasInvalidViewIds(_crossDeviceLinkMethods)
    ) {
      return defaultViewRendersMap
    }

    return _crossDeviceLinkMethods.reduce(
      (result: viewRendersMapType, viewId: string) => {
        result[viewId] = defaultViewRendersMap[viewId]
        return result
      },
      {}
    )
  }

  getVisibleViewOptions = (
    requiredViewRenders: viewRendersMapType
  ): SecureLinkViewType => {
    const { _crossDeviceLinkMethods } = this.props
    if (
      _crossDeviceLinkMethods?.length &&
      !configHasInvalidViewIds(_crossDeviceLinkMethods)
    ) {
      const result = _crossDeviceLinkMethods
        .map((viewId: string) =>
          SECURE_LINK_VIEWS.find((view) => view.id === viewId)
        )
        .filter(Boolean)
      return result as SecureLinkViewType
    }
    return SECURE_LINK_VIEWS.filter((view) => view.id in requiredViewRenders)
  }

  componentWillUnmount() {
    this.clearSendLinkClickTimeout()
  }

  render() {
    const { translate, trackScreen } = this.props
    const { error, currentViewId } = this.state
    const requiredViewRenders = this.getRequiredViewRenders()
    const currentViewRender = requiredViewRenders[currentViewId]
    const visibleViewOptions = this.getVisibleViewOptions(requiredViewRenders)

    return (
      <div className={style.container} data-page-id={'CrossDeviceLink'}>
        {error?.type ? (
          <Error role="alert" error={error} trackScreen={trackScreen} />
        ) : (
          <PageTitle
            title={translate('get_link.title')}
            subTitle={translate(
              visibleViewOptions.find(({ id }) => id === currentViewId)
                ?.subtitle as string
            )}
          />
        )}
        <div className={style.secureLinkView}>
          <div
            role="region"
            id="selectedLinkView"
            className={style.selectedLinkView}
          >
            {currentViewRender()}
          </div>
          {visibleViewOptions.length > 1 && (
            <div role="heading" aria-level="2" className={style.styledLabel}>
              {translate('get_link.link_divider')}
            </div>
          )}
          <div
            className={style.viewOptionsGroup}
            aria-controls="selectedLinkView"
          >
            {visibleViewOptions
              .filter((view) => view.id !== currentViewId)
              .map((view) => (
                <a
                  href="#"
                  className={classNames(
                    theme.link,
                    style.viewOption,
                    style[view.className]
                  )}
                  ref={this.viewOptionBtn}
                  onClick={preventDefaultOnClick(() =>
                    this.handleViewOptionSelect(view.id)
                  )}
                  key={`view_${view.id}`}
                >
                  {translate(view.label)}
                </a>
              ))}
          </div>
        </div>
      </div>
    )
  }
}

export default CrossDeviceLinkUI
