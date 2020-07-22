import { h } from 'preact'
import classNames from 'classnames'
import { Button } from '@onfido/castor'
import { localised } from '../../locales'
import theme from '../Theme/style.scss'
import style from './style.scss'

const RetakeAction = localised(({ retakeAction, translate, btnSize }) => (
  <Button
    variant="secondary"
    className={theme[`button-${btnSize}`]}
    onClick={retakeAction}
    data-onfido-qa="redo-action-btn"
  >
    {translate('confirm.redo')}
  </Button>
))

const ConfirmAction = localised(
  ({ confirmAction, isUploading, translate, error }) => (
    <Button
      variant="primary"
      className={theme['button-sm']}
      onClick={confirmAction}
      disabled={isUploading}
      data-onfido-qa="confirm-action-btn"
    >
      {error.type === 'warn'
        ? translate('confirm.continue')
        : translate('confirm.confirm')}
    </Button>
  )
)

const Actions = ({ retakeAction, confirmAction, isUploading, error }) => (
  <div className={style.actionsContainer}>
    <div
      className={classNames(style.actions, {
        [style.error]: error.type === 'error',
      })}
    >
      <RetakeAction
        {...{ retakeAction }}
        btnSize={error.type === 'error' ? 'lg' : 'sm'}
      />
      {error.type === 'error' ? null : (
        <ConfirmAction {...{ confirmAction, isUploading, error }} />
      )}
    </div>
  </div>
)

export default Actions
