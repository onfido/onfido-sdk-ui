import ReactModal from 'react-modal'
import { h, toChildArray } from 'preact'
import classNames from 'classnames'
import { withFullScreenState } from '../FullScreen'
import { getCSSMilisecsValue, wrapWithClass } from '~utils'
import { localised } from '../../locales'
import style from './style.scss'

const MODAL_ANIMATION_DURATION = getCSSMilisecsValue(
  style.modal_animation_duration
)

const Wrapper = ({ children }) =>
  wrapWithClass(style.inner, toChildArray(children))

const Modal = ({
  translate,
  children,
  isOpen,
  isFullScreen,
  onRequestClose,
  containerId,
  containerEl,
  shouldCloseOnOverlayClick,
}) => (
  <ReactModal
    isOpen={isOpen}
    onRequestClose={onRequestClose}
    portalClassName={style.portal}
    overlayClassName={style.overlay}
    bodyClassName={style.modalBody}
    className={style.inner}
    shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
    closeTimeoutMS={MODAL_ANIMATION_DURATION}
    appElement={containerEl || document.getElementById(containerId)}
  >
    <button
      type="button"
      aria-label={translate('generic.accessibility.close_sdk_screen')}
      onClick={onRequestClose}
      className={classNames(style.closeButton, {
        [style.closeButtonFullScreen]: isFullScreen,
      })}
    >
      <span className={style.closeButtonLabel} aria-hidden="true">
        {translate('generic.close')}
      </span>
    </button>
    {toChildArray(children)}
  </ReactModal>
)

Modal.defaultProps = {
  shouldCloseOnOverlayClick: true,
}

const LocalisedModal = withFullScreenState(localised(Modal))

const WrappedModal = ({ useModal, children, ...otherProps }) =>
  useModal ? (
    <LocalisedModal {...otherProps}>{toChildArray(children)}</LocalisedModal>
  ) : (
    <Wrapper>{toChildArray(children)}</Wrapper>
  )

export default WrappedModal
