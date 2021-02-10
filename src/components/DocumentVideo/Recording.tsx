import { h, FunctionComponent } from 'preact'
import { memo } from 'preact/compat'

import Button from '../Button'
import style from './style.scss'

export type Props = {
  buttonText: string
  children?: h.JSX.Element | h.JSX.Element[]
  disableInteraction?: boolean
  onNext?: () => void
  onStop: () => void
  hasMoreSteps?: boolean
}

const Recording: FunctionComponent<Props> = ({
  buttonText,
  children,
  disableInteraction = false,
  hasMoreSteps = false,
  onNext,
  onStop,
}) => (
  <div className={style.actions}>
    {children}
    <Button
      variants={['centered', 'primary', 'lg']}
      disabled={disableInteraction}
      onClick={hasMoreSteps ? onNext : onStop}
    >
      {buttonText}
    </Button>
  </div>
)

export default memo(Recording)
