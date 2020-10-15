import { h } from 'preact'
import classNames from 'classnames'
import Button from '../Button'
import { localised } from '../../locales'
import style from './style.scss'

const RetakeAction = localised(({ retakeAction, translate, singleAction }) => (
  <Button
    onClick={retakeAction}
    className={singleAction ? null : style.retakeAction}
    variants={
      singleAction ? ['primary', 'lg', 'centered'] : ['secondary', 'sm']
    }
  >
    {translate(
      singleAction
        ? 'doc_confirmation.button_primary_redo'
        : 'doc_confirmation.button_secondary_redo'
    )}
  </Button>
))

const ConfirmAction = localised(
  ({ confirmAction, isUploading, translate, error }) => (
    <Button
      variants={['primary', 'sm']}
      onClick={confirmAction}
      disabled={isUploading}
    >
      {error.type === 'warn'
        ? translate('doc_confirmation.button_primary_upload_anyway')
        : translate('doc_confirmation.button_primary_upload')}
    </Button>
  )
)

const Actions = ({
  retakeAction,
  confirmAction,
  isUploading,
  error,
  forceRetake,
}) => (
  <div className={style.actionsContainer}>
    <div
      className={classNames(style.actions, {
        [style.singleAction]: forceRetake,
      })}
    >
      <RetakeAction {...{ retakeAction, singleAction: forceRetake }} />
      {!forceRetake && (
        <ConfirmAction {...{ confirmAction, isUploading, error }} />
      )}
    </div>
  </div>
)

export default Actions
