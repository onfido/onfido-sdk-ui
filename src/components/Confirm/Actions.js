import { h } from 'preact'
import classNames from 'classnames'
import Button from '../Button'
import { localised } from '../../locales'
import style from './style.scss'

const RetakeAction = localised(({ retakeAction, translate, forceRetake }) => (
  <Button
    onClick={retakeAction}
    className={forceRetake ? null : style.retakeAction}
    variants={forceRetake ? ['primary', 'lg', 'centered'] : ['secondary', 'sm']}
  >
    {translate('confirm.redo')}
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
        ? translate('confirm.continue')
        : translate('confirm.confirm')}
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
      <RetakeAction {...{ retakeAction, forceRetake }} />
      {forceRetake ? null : (
        <ConfirmAction {...{ confirmAction, isUploading, error }} />
      )}
    </div>
  </div>
)

export default Actions
