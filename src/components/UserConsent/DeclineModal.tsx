import ReactModal from 'react-modal'
import { h, FunctionComponent, ComponentChildren } from 'preact'
import classNames from 'classnames'
import { getCSSMillisecsValue } from '~utils'
import style from './style.scss'
import styleConstants from '../Theme/constants.scss'
import theme from '../Theme/style.scss'

const MODAL_ANIMATION_DURATION = getCSSMillisecsValue(
  styleConstants.modal_animation_duration
)

type DeclineModalProps = {
  children: ComponentChildren
  isOpen: boolean
  onRequestClose: void
  containerEl: HTMLElement
  containerId: string
}

const DeclineModal: FunctionComponent<DeclineModalProps> = ({
  children,
  isOpen,
  onRequestClose,
  containerEl,
  containerId,
}: DeclineModalProps) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      overlayClassName={{
        base: theme.modalOverlay,
        afterOpen: theme['modalOverlay--after-open'],
        beforeClose: theme['modalOverlay--before-close'],
      }}
      portalClassName={theme.portal}
      bodyOpenClassName={theme.modalBody}
      className={classNames(style.declineModalInner, theme.modalInner)}
      role={'dialog'}
      shouldCloseOnOverlayClick={false}
      closeTimeoutMS={MODAL_ANIMATION_DURATION}
      appElement={containerEl || document.getElementById(containerId)}
    >
      <div className={style.declineChild}>{children}</div>
    </ReactModal>
  )
}

export default DeclineModal
