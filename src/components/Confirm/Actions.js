import { h } from 'preact'
import { Button } from '@onfido/castor-react'
import classNames from 'classnames'
import { localised } from '../../locales'
import { isButtonGroupStacked } from '../Theme/utils'
import theme from '../Theme/style.scss'
import style from './style.scss'

const RetakeAction = localised(({ retakeAction, translate, singleAction }) => (
  <Button
    onClick={retakeAction}
    variant={singleAction ? 'primary' : 'secondary'}
    className={
      singleAction
        ? classNames(theme['button-lg'], theme['button-centered'])
        : classNames(theme['button-sm'], style.retakeAction, {
            [style.vertical]: isButtonGroupStacked(),
          })
    }
    data-onfido-qa="redo-action-btn"
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
      variant="primary"
      className={classNames(theme['button-sm'], {
        [theme.vertical]: isButtonGroupStacked(),
      })}
      onClick={confirmAction}
      disabled={isUploading}
      data-onfido-qa="confirm-action-btn"
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
        [style.vertical]: isButtonGroupStacked(),
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
