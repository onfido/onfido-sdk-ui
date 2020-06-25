import { h, Component } from 'preact'
import classNames from 'classnames'

import theme from '../../Theme/style.css'
import style from './style.css'
import { performHttpReq } from '~utils/http'
import Spinner from '../../Spinner'
import Button from '../../Button'
import CopyLink from './CopyLink'
import PhoneNumberInputLazy from '../../PhoneNumberInput/Lazy'
import QRCodeGenerator from '../../QRCode'
import QRCodeHowTo from '../../QRCode/HowTo'
import Error from '../../Error'
import PageTitle from '../../PageTitle'
import { trackComponent, sendEvent } from '../../../Tracker'
import { localised } from '../../../locales'
import { createSocket } from '~utils/crossDeviceSync'

class SmsError extends Component {
  componentDidMount() {
    const errorName = this.props.error.name.toLowerCase()
    this.props.trackScreen([errorName])
  }
  render = ({ error }) => <Error role="alert" {...{ error }} />
}

class CrossDeviceLink extends Component {
  constructor(props) {
    super(props)

    if (!props.socket) {
      const url = props.urls.sync_url
      const socket = createSocket(url)
      socket.on('connect', () => {
        const roomId = this.props.roomId || null
        socket.emit('join', {roomId})
      })
      socket.on('joined', this.onJoined)
      socket.open()
      props.actions.setSocket(socket)
    }
  }

  componentDidMount() {
    this.listen(this.props.socket)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.socket !== this.props.socket) {
      this.unlisten(this.props.socket)
      this.listen(nextProps.socket)
    }
  }

  componentWillUnmount() {
    this.unlisten(this.props.socket)
  }

  unlisten = (socket) => {
    if (!socket) return
    socket.off('get config', this.onGetConfig)
    socket.off('client success', this.onClientSuccess)
  }

  listen = (socket) => {
    if (!socket) return
    socket.on('get config', this.onGetConfig)
    socket.on('client success', this.onClientSuccess)
  }

  onJoined = (data) => {
    const {actions, roomId} = this.props
    if (!roomId) {
      actions.setRoomId(data.roomId)
    }
  }

  onGetConfig = (data) => {
    const { roomId, mobileConfig, socket, actions, nextStep } = this.props
    if (roomId && roomId !== data.roomId) {
      socket.emit('leave', {roomId})
    }
    actions.mobileConnected(true)
    this.sendMessage('config', data.roomId, mobileConfig)
    nextStep()
  }

  onClientSuccess = () => {
    const { actions } = this.props
    actions.setClientSuccess(true)
    this.props.nextStep()
  }

  sendMessage = (event, roomId, payload) => {
    this.props.socket.emit('message', {event, payload, roomId})
  }

  render = () =>
    this.props.roomId ? <CrossDeviceLinkUI {...this.props} /> : <Spinner />
}

class CrossDeviceLinkUI extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentViewId: 'qr_code',
      sending: false,
      error: {},
      validNumber: true
    }
  }

  linkId = `${process.env.BASE_32_VERSION}${this.props.roomId}`

  setError = (name) => this.setState({ error: { name, type: 'error' } })

  clearErrors = () => {
    this.clearSendLinkClickTimeout()
    this.setState({
      error: {},
      validNumber: true
    })
  }

  handleResponse = (response) => {
    this.clearSendLinkClickTimeout()
    this.setState({ sending: false })
    if (response.status === 'OK') {
      this.props.nextStep()
    } else {
      this.setError('SMS_FAILED')
    }
  }

  handleSMSError = (error) => {
    this.clearSendLinkClickTimeout()
    this.setState({ sending: false })
    this.props.triggerOnError(error)
    status === 429 ? this.setError('SMS_OVERUSE') : this.setError('SMS_FAILED')
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
      payload: JSON.stringify({ to: sms.number, id: this.linkId, language: language.substring(0, 2) }),
      endpoint: `${url}/v1/cross_device_sms`,
      contentType: 'application/json',
      token: `Bearer ${token}`
    }
    performHttpReq(options, this.handleResponse, this.handleSMSError)
  }

  getMobileUrl = () => {
    const { hosted_sdk_url, cross_device_url } = this.props.urls
    const mobileUrl = cross_device_url || hosted_sdk_url
    // This lets us test the cross device flow locally and on Surge.
    // We use the same location to test the same bundle as the desktop flow.
    return process.env.MOBILE_URL === "/" ?
      `${window.location.origin}?link_id=${this.linkId}` :
      `${mobileUrl}/${this.linkId}`
  }

  clearSendLinkClickTimeout() {
    if (this.sendLinkClickTimeoutId) {
      clearTimeout(this.sendLinkClickTimeoutId)
    }
  }

  renderSmsLinkSection = () => {
    const { translate } = this.props
    const { sending, validNumber } = this.state
    const buttonCopyKey = sending ?
      'cross_device.link.button_copy.status' :
      'cross_device.link.button_copy.action'
    const invalidNumber = !validNumber
    return (
      <div>
        <div className={style.smsSection}>
          <div className={style.label}>
            {translate('cross_device.link.sms_label')}
          </div>
          <div className={style.numberInputSection}>
            <div
              className={classNames(style.inputContainer, {
                [style.fieldError]: invalidNumber
              })}
            >
              <PhoneNumberInputLazy
                {...this.props}
                clearErrors={this.clearErrors}
              />
            </div>
            <Button
              ariaLive="polite"
              ariaRelevant="text"
              ariaBusy={sending}
              className={classNames(style.btn, { [style.sending]: sending })}
              variants={['primary']}
              onClick={this.handleSendSmsLinkClick}
              disabled={sending || invalidNumber}
            >
              {translate(buttonCopyKey)}
            </Button>
          </div>
        </div>
        <div role="alert" hidden={!invalidNumber}>
          {invalidNumber && (
            <div className={style.numberError}>
              {translate('errors.invalid_number.message')}
            </div>
          )}
        </div>
      </div>
    )
  }

  renderCopyLinkSection = () => <CopyLink mobileUrl={this.getMobileUrl()} />

  renderQrCodeSection = () => (
    <div className={style.qrCodeSection}>
      <div className={style.qrCodeContainer}>
        <QRCodeGenerator url={this.getMobileUrl()} size={144} />
      </div>
      <QRCodeHowTo />
    </div>
  )

  handleViewOptionSelect = (newViewId) => {
    sendEvent(`${newViewId.replace('_',' ')} selected`)
    this.setState({ currentViewId: newViewId })
    this.viewOptionBtn.blur()
  }

  componentWillUnmount() {
    this.clearSendLinkClickTimeout()
  }

  render() {
    const { translate, trackScreen } = this.props
    const { error, currentViewId } = this.state
    const secureLinkViews = [{
      id: 'qr_code',
      className: 'qrCodeLinkOption',
      label: 'cross_device.link.qr_code_option',
      render: this.renderQrCodeSection
    },{
      id: 'sms',
      className: 'smsLinkOption',
      label: 'cross_device.link.sms_option',
      render: this.renderSmsLinkSection
    },{
      id: 'copy_link',
      className: 'copyLinkOption',
      label: 'cross_device.link.copy_link_option',
      render: this.renderCopyLinkSection
    }]
    const currentView = secureLinkViews.find(view => view.id === currentViewId)
    return (
      <div className={style.container}>
        {error.type ? (
          <SmsError error={error} trackScreen={trackScreen} />
        ) : (
          <PageTitle
            title={translate('cross_device.link.title')}
            subTitle={translate(`cross_device.link.${currentViewId}_sub_title`)} />
        )}
        <div className={classNames(theme.thickWrapper, style.secureLinkView)}>
          <div role="region" id="selectedLinkView">
            {currentView.render()}
          </div>
          <p className={style.styledLabel}>
            {translate('cross_device.link.options_divider_label')}
          </p>
          <div className={style.viewOptions} aria-controls="selectedLinkView">
            {secureLinkViews
              .filter(view => view.id !== this.state.currentViewId)
              .map(view => (
                <button
                  type="button"
                  className={classNames(theme.link, style.viewOption, style[view.className])}
                  ref={(node) => (this.viewOptionBtn = node)}
                  onClick={() => this.handleViewOptionSelect(view.id)}>
                  {translate(view.label)}
                </button>
              ))}
          </div>
        </div>
      </div>
    )
  }
}

export default trackComponent(localised(CrossDeviceLink), 'crossdevice_link')
