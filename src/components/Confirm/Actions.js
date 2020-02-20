import { h } from 'preact'
import classNames from 'classnames'
import style from './style.css'
import Button from '../Button'
import { localised } from '../../locales'

const RetakeAction = localised(({retakeAction, translate}) =>
  <Button
    onClick={retakeAction}
    className={style['btn-secondary']}
    variants={['secondary']}
  >
    {translate('confirm.redo')}
  </Button>
)

const ConfirmAction = localised(({ confirmAction, isUploading, translate, error }) =>
  <Button
    className={style['btn-primary']}
    variants={['primary']}
    onClick={confirmAction}
    disabled={isUploading}
  >
    { error.type === 'warn' ? translate('confirm.continue') : translate('confirm.confirm') }
  </Button>
)

const Actions = ({ retakeAction, confirmAction, isUploading, error }) => (
  <div className={style.actionsContainer}>
    <div className={classNames(
        style.actions,
        {[style.error]: error.type === 'error'}
      )}>
      <RetakeAction {...{retakeAction}} />
      { error.type === 'error' ?
        null : <ConfirmAction {...{ confirmAction, isUploading, error }} /> }
    </div>
  </div>
)

export default Actions