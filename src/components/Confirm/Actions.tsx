import { h } from 'preact'
import { Button } from '@onfido/castor-react'
import classNames from 'classnames'
import { useLocales } from '~locales'
import { isButtonGroupStacked } from '../Theme/utils'
import theme from '../Theme/style.scss'
import style from './Actions.scss'
import { ErrorProp } from '~types/routers'

type ActionsProps = {
  retakeAction: () => void
  forceRetake: boolean
  confirmAction: () => void
  isUploading: boolean
  error?: ErrorProp
}

type RetakeActionProps = { singleAction: boolean } & Pick<
  ActionsProps,
  'retakeAction'
>

type ConfirmActionsProps = Pick<
  ActionsProps,
  'confirmAction' | 'isUploading' | 'error'
>

const RetakeAction = ({ retakeAction, singleAction }: RetakeActionProps) => {
  const { translate } = useLocales()

  return (
    <Button
      type="button"
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
  )
}

const ConfirmAction = ({
  confirmAction,
  isUploading,
  error,
}: ConfirmActionsProps) => {
  const { translate } = useLocales()
  return (
    <Button
      type="button"
      variant="primary"
      className={classNames(theme['button-sm'], {
        [theme.vertical]: isButtonGroupStacked(),
      })}
      onClick={confirmAction}
      disabled={isUploading}
      data-onfido-qa="confirm-action-btn"
    >
      {error?.type === 'warning'
        ? translate('doc_confirmation.button_primary_upload_anyway')
        : translate('doc_confirmation.button_primary_upload')}
    </Button>
  )
}

const Actions = ({
  retakeAction,
  confirmAction,
  isUploading,
  error,
  forceRetake,
}: ActionsProps) => (
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
