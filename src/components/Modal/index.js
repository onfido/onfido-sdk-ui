import style from './style.css'
import ReactModal from 'react-modal'
import { h, Component } from 'preact'
import { getCSSMilisecsValue, wrapWithClass } from '../utils'

const MODAL_ANIMATION_DURATION = getCSSMilisecsValue(style.modal_animation_duration)

const Wrapper = ({children}) =>
  wrapWithClass(style.inner, children)

class ModalStrict extends Component {
  constructor (props) {
    super(props)
    this.state = {isOpen: false}
  }

  openModal = () => {
    this.setState({isOpen: true})
  }

  onRequestClose = () => {
    this.setState({isOpen: false})
  }

  render () {
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
        {this.props.children}
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
  render = () => <ModalPure {...this.props}/>
}

export default Modal
