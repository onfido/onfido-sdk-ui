import { h } from 'preact'
import classNames from 'classnames'
import { Button } from '@onfido/castor'
import { localised } from '../../locales'
import style from './style.scss'

const RetakeAction = localised(({ retakeAction, translate, btnSize }) => (
  <Button
    variant='secondary'
    className={classNames(style['button-secondary'], style[`button-${btnSize}`])}
    onClick={retakeAction}
  >
    {translate('confirm.redo')}
  </Button>
))

const ConfirmAction = localised(
  ({ confirmAction, isUploading, translate, error }) => (
    <Button
      variant="primary"
      className={style['button-sm']}
      onClick={confirmAction}
      disabled={isUploading}
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
