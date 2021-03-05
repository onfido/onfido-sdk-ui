import ReactModal from 'react-modal'
import { h } from 'preact'
import classNames from 'classnames'
import { withFullScreenState } from '../FullScreen'
import { getCSSMillisecsValue, wrapWithClass } from '~utils'
import { localised } from '../../locales'
import style from './style.scss'
import styleConstants from '../Theme/constants.scss'
import theme from '../Theme/style.scss'

const MODAL_ANIMATION_DURATION = getCSSMillisecsValue(
  styleConstants.modal_animation_duration
)

const Wrapper = ({ children }) => wrapWithClass(style.inner, children)

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
    portalClassName={theme.portal}
    overlayClassName={{
      base: theme.modalOverlay,
      afterOpen: theme['modalOverlay--after-open'],
      beforeClose: theme['modalOverlay--before-close'],
    }}
    bodyOpenClassName={theme.modalBody}
    className={classNames(theme.modalInner, style.inner)}
    role={'dialog'}
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
    {children}
  </ReactModal>
)

Modal.defaultProps = {
  shouldCloseOnOverlayClick: true,
}

const LocalisedModal = withFullScreenState(localised(Modal))

const WrappedModal = ({ useModal, children, ...otherProps }) =>
  useModal ? (
    <LocalisedModal {...otherProps}>{children}</LocalisedModal>
  ) : (
    <Wrapper>{children}</Wrapper>
  )

export default WrappedModal
