import style from './style.css'
import ReactModal from 'react-modal'
import { h, Component } from 'preact'
import classNames from 'classnames'
import { withFullScreenState } from '../FullScreen'
import { getCSSMilisecsValue, wrapWithClass } from '../utils'
import { localised } from '../../locales'

const MODAL_ANIMATION_DURATION = getCSSMilisecsValue(style.modal_animation_duration)

const Wrapper = ({children}) =>
  wrapWithClass(style.inner, children)

class Modal extends Component {
  constructor (props) {
    super(props)
    this.state = {isOpen: !!props.isOpen}
  }

  componentWillReceiveProps(nextProps) {
    this.setState({isOpen: nextProps.isOpen})
  }

  onRequestClose = () => {
    this.setState({isOpen: false})
  }

  render () {
    const { translate, isFullScreen } = this.props
    return (
      <ReactModal
        isOpen={this.state.isOpen}
        onRequestClose={this.props.onRequestClose || this.onRequestClose}
        portalClassName={style.portal}
        overlayClassName={style.overlay}
        bodyClassName={style.modalBody}
        className={style.inner}
        shouldCloseOnOverlayClick={true}
        closeTimeoutMS={MODAL_ANIMATION_DURATION}
        ariaHideApp={false}
      >
        <button
          className={classNames(style.closeButton, {
            [style.closeButtonFullScreen]: isFullScreen,
          })}
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

const LocalisedModal = withFullScreenState(localised(Modal))

export default ({useModal, children, ...otherProps}) => (
  useModal ?
    <LocalisedModal {...otherProps}>{children}</LocalisedModal> :
    <Wrapper>{children}</Wrapper>
)
