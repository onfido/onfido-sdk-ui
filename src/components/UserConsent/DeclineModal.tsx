import ReactModal from 'react-modal'
import { h, FunctionComponent } from 'preact'
import { useLocales } from '~locales'
import classNames from 'classnames'
import { Button } from '@onfido/castor-react'

import { getCSSMillisecsValue } from '~utils'
import style from './style.scss'
import styleConstants from '../Theme/constants.scss'
import theme from '../Theme/style.scss'

const MODAL_ANIMATION_DURATION = getCSSMillisecsValue(
  styleConstants.modal_animation_duration
)

type DeclineModalProps = {
  isOpen: boolean
  onRequestClose(): void
  containerEl?: HTMLElement
  onDismissModal(): void
  onAbandonFlow(): void
}

type ActionsProps = {
  onAbandonFlow(): void
  onDismissModal(): void
}

const Actions: FunctionComponent<ActionsProps> = ({
  onAbandonFlow,
  onDismissModal,
}) => {
  const { translate } = useLocales()
  const primaryBtnCopy = translate('user_consent.prompt.button_primary')
  const secondaryBtnCopy = translate('user_consent.prompt.button_secondary')

  return (
    <div className={classNames(style.actions, style.modalActions)}>
      <Button
        type="button"
        variant="secondary"
        className={classNames(
          theme['button-centered'],
          theme['button-sm'],
          style.secondary
        )}
        data-onfido-qa="userConsentDeclineModalBtnSecondary"
        onClick={() => onAbandonFlow()}
      >
        {secondaryBtnCopy}
      </Button>
      <Button
        type="button"
        variant="primary"
        className={classNames(theme['button-centered'], theme['button-sm'])}
        data-onfido-qa="userConsentDeclineModalBtnPrimary"
        onClick={() => onDismissModal()}
      >
        {primaryBtnCopy}
      </Button>
    </div>
  )
}

const DeclineModal: FunctionComponent<DeclineModalProps> = ({
  isOpen,
  onRequestClose,
  containerEl,
  onDismissModal,
  onAbandonFlow,
}: DeclineModalProps) => {
  const { translate } = useLocales()

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
      shouldCloseOnOverlayClick={true}
      closeTimeoutMS={MODAL_ANIMATION_DURATION}
      appElement={containerEl}
      data-onfido-qa="userConsentDeclineModal"
    >
      <div
        className={style.modalContent}
        data-onfido-qa="userConsentDeclineModalContent"
      >
        <h2>{translate('user_consent.prompt.no_consent_title')}</h2>
        <p>{translate('user_consent.prompt.no_consent_detail')}</p>
        <Actions {...{ onAbandonFlow, onDismissModal }} />
      </div>
    </ReactModal>
  )
}

export default DeclineModal
