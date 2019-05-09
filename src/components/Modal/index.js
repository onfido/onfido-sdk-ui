import style from './style.css'
import ReactModal from 'react-modal'
import { h, Component } from 'preact'
import classNames from 'classnames'
import { withFullScreenState } from '../FullScreen'
import { getCSSMilisecsValue, wrapWithClass } from '~utils'
import { localised } from '../../locales'

const MODAL_ANIMATION_DURATION = getCSSMilisecsValue(style.modal_animation_duration)

const Wrapper = ({children}) =>
  wrapWithClass(style.inner, children)

class Modal extends Component {
  render () {
    const { translate, isFullScreen } = this.props
    return (
      <ReactModal
        isOpen={this.props.isOpen}
        onRequestClose={this.props.onRequestClose}
        portalClassName={style.portal}
        overlayClassName={style.overlay}
        bodyClassName={style.modalBody}
        className={style.inner}
        shouldCloseOnOverlayClick={true}
        closeTimeoutMS={MODAL_ANIMATION_DURATION}
        appElement={document.body}
      >
        <button
          aria-label={translate('accessibility.close_sdk_screen')}
          className={classNames(style.closeButton, {
            [style.closeButtonFullScreen]: isFullScreen,
          })}
          onClick={this.props.onRequestClose}
        >
          <span className={style.closeButtonLabel} aria-hidden="true">
            {translate('close')}
          </span>
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
