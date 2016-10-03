import { events } from 'onfido-sdk-core'
import style from './style.css'
import ReactModal from 'react-modal'
import { h, render, Component } from 'preact'
import { getCSSMilisecsValue, wrapWithClass, impurify } from '../utils'

const MODAL_ANIMATION_DURATION = getCSSMilisecsValue(style.modal_animation_duration)

const WrapperContent = ({children}) =>
  wrapWithClass(style.content, children)

const Wrapper = ({children}) =>
  wrapWithClass(style.inner, <WrapperContent>{children}</WrapperContent>)

class ModalStrict extends Component {
  constructor (props) {
    super(props)
    this.state = {isOpen: false}
  }

  componentDidMount() {
    const { buttonId } = this.props
    console.log("componentDidMount",buttonId)
    const button = document.getElementById(buttonId)
    if (!button){
      console.warn(`The button with id #${buttonId} cannot be found`)
      return
    }
    button.addEventListener('click', this.openModal)
    button.disabled = false
    this.setState({button})
  }

  componentWillUnmount() {
    const { button } = this.state
    if (button) button.removeEventListener('click', this.openModal)
  }

  openModal = () => {
    events.emit('onBeforeOpen')
    this.setState({isOpen: true})
  }

  onAfterOpen = () => events.emit('onOpen')

  onRequestClose = () => {
    console.log("onRequestClose")
    events.emit('onBeforeClose')
    this.setState({isOpen: false})
  }

  onAfterClose = () => events.emit('onClose')

  //TODO get rid of preact or wait for a new version that supports pure components properly
  //ReactModal is a standard React Component, therefore we have to force preact-compat on it
  //the problem is that preact still doesn't support pure components, so we have to impurify its child
  static WrapperContentImpure = impurify(WrapperContent)

  render () {
    return (
      <ReactModal
        isOpen={this.state.isOpen || this.props.isOpen}
        onAfterOpen={this.onAfterOpen}
        onRequestClose={this.onRequestClose}
        onAfterClose={this.onAfterClose}
        portalClassName={style.portal}
        overlayClassName={style.overlay}
        bodyClassName={style.modalBody}
        className={style.inner}
        shouldCloseOnOverlayClick={true}
        closeTimeoutMS={MODAL_ANIMATION_DURATION}
      >
        <ModalStrict.WrapperContentImpure>
          {this.props.children}
        </ModalStrict.WrapperContentImpure>
      </ReactModal>
    )
  }
}

const ModalPure = ({useModal, children, ...otherProps}) => (
  useModal ?
    <ModalStrict {...otherProps}>{children}</ModalStrict> :
    <Wrapper>{children}</Wrapper>
)

class Modal extends Component {
  componentDidMount () {
    if (!this.props.useModal){
      events.emit('onBeforeOpen')
      events.emit('onOpen')
    }
  }

  render = () => <ModalPure {...this.props}/>
}

export default Modal
