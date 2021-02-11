import { h, FunctionComponent } from 'preact'
import { memo, useCallback } from 'preact/compat'
import classNames from 'classnames'
import style from './style.scss'

export type Props = {
  stepFinished?: boolean
  stepNumber?: number
  totalSteps: number
}

const ProgressBar: FunctionComponent<Props> = ({
  stepFinished = false,
  stepNumber = 0,
  totalSteps,
}) => {
  const getStepActiveState = useCallback(
    (stepIndex: number): boolean => {
      if (stepIndex >= stepNumber) {
        return false
      }

      if (stepIndex < stepNumber - 1) {
        return true
      }

      return stepFinished
    },
    [stepFinished, stepNumber]
  )

  return (
    <div className={style.progress}>
      {Array(totalSteps)
        .fill(null)
        .map((_step, index) => (
          <span
            className={classNames(style.step, {
              [style.active]: getStepActiveState(index),
            })}
            key={`document-video-progress-${index}`}
          />
        ))}
    </div>
  )
}

export default memo(ProgressBar)
