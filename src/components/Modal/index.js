import style from './style.css'
import ReactModal from 'react-modal'
import { h, Component } from 'preact'
import { getCSSMilisecsValue, wrapWithClass } from '../utils'
import { localised } from '../../locales'

const MODAL_ANIMATION_DURATION = getCSSMilisecsValue(style.modal_animation_duration)

const Wrapper = ({children}) =>
  wrapWithClass(style.inner, children)

class ModalStrict extends Component {
  constructor (props) {
    super(props)
    this.state = {isOpen: false}
  }

  componentDidMount() {
    const { buttonId } = this.props
    console.log(buttonId)
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
    this.setState({isOpen: true})
  }

  onRequestClose = () => {
    this.setState({isOpen: false})
  }

  render () {
    const { translate } = this.props
    return (
      <ReactModal
        isOpen={this.state.isOpen || this.props.isOpen}
        onRequestClose={this.props.onRequestClose || this.onRequestClose}
        portalClassName={style.portal}
        overlayClassName={style.overlay}
        bodyClassName={style.modalBody}
        className={style.inner}
        shouldCloseOnOverlayClick={true}
        closeTimeoutMS={MODAL_ANIMATION_DURATION}
      >
        <button
          className={style.closeButton}
          onClick={this.props.onRequestClose || this.onRequestClose}
        >
          <span className={style.closeButtonLabel}>{
            translate('close')
          }</span>
        </button>
        {this.props.children}
      </ReactModal>
    )
  }
}

const LocalisedModalStrict = localised(ModalStrict)

const ModalPure = ({useModal, children, ...otherProps}) => (
  useModal ?
    <LocalisedModalStrict {...otherProps}>{children}</LocalisedModalStrict> :
    <Wrapper>{children}</Wrapper>
)

class Modal extends Component {
  render = () => <ModalPure {...this.props}/>
}

export default Modal
