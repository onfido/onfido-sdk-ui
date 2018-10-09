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
    this.state = {isOpen: false}
  }

  onAfterOpen = () => {
    setTimeout(()=>{
      this.setState({reallyOpened:true})
    },1)
  }

  componentWillReceiveProps({isOpen}) {
    if (this.props.isOpen && !isOpen){
      this.setState({reallyOpened: false})
    }
  }

  modalClasses = (className) => ({
    base: classNames(
      style[className],
      this.state.reallyOpened ? style[`${className}AfterOpen`] : false
    ),
    afterOpen: "",
    beforeClose: style[`${className}BeforeClose`]
  })

  render () {
    const { translate, isFullScreen } = this.props
    return (
      <ReactModal
        isOpen={this.props.isOpen}
        onAfterOpen={this.onAfterOpen}
        onRequestClose={this.props.onRequestClose}
        portalClassName={style.portal}
        bodyOpenClassName={style.modalBody}
        overlayClassName={this.modalClasses('overlay')}
        className={this.modalClasses('inner')}
        shouldCloseOnOverlayClick={true}
        closeTimeoutMS={MODAL_ANIMATION_DURATION}
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
