import { h, FunctionComponent } from 'preact'

import Button from '../Button'
import ProgressBar from './ProgressBar'
import style from './style.scss'

export type Props = {
  buttonText: string
  children?: h.JSX.Element | h.JSX.Element[]
  disableInteraction?: boolean
  onNext?: () => void
  onStop: () => void
  stepNumber: number
  totalSteps: number
}

const Recording: FunctionComponent<Props> = ({
  buttonText,
  children,
  disableInteraction = false,
  onNext,
  onStop,
  stepNumber,
  totalSteps,
}) => (
  <div>
    <div className={style.actions}>
      <ProgressBar stepNumber={stepNumber} totalSteps={totalSteps} />
      {children}
      <Button
        variants={['centered', 'primary', 'lg']}
        disabled={disableInteraction}
        onClick={stepNumber < totalSteps ? onNext : onStop}
      >
        {buttonText}
      </Button>
    </div>
  </div>
)

export default Recording
