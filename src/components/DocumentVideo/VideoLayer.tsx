import { h, FunctionComponent, Fragment } from 'preact'
import { memo, useCallback, useState } from 'preact/compat'

import { useLocales } from '~locales'
import Button from '../Button'
import Instructions from './Instructions'
import ProgressBar from './ProgressBar'
import style from './style.scss'

import type { DocInstructionLocale } from '~utils/localesMapping'
import type { VideoLayerProps } from '../VideoCapture'

export type Props = {
  instructionKeys: DocInstructionLocale[]
  onNext: () => void
  stepNumber: number
  totalSteps: number
} & VideoLayerProps

const SUCCESS_STATE_TIMEOUT = 1000

const VideoLayer: FunctionComponent<Props> = ({
  disableInteraction,
  instructionKeys,
  isRecording,
  onNext,
  onStart,
  onStop,
  stepNumber,
  totalSteps,
}) => {
  const [stepFinished, setStepFinished] = useState(false)
  const { translate } = useLocales()

  const handleNext = useCallback(() => {
    if (stepNumber === 0) {
      onNext()
      return
    }

    setStepFinished(true)

    setTimeout(() => {
      if (stepNumber >= totalSteps) {
        onStop()
        return
      }

      onNext()
      setStepFinished(false)
    }, SUCCESS_STATE_TIMEOUT)
  }, [stepNumber, totalSteps, onNext, onStop])

  const { title, subtitle, button } = instructionKeys[stepNumber]

  const instruction = (
    <Instructions
      subtitle={subtitle ? translate(subtitle) : undefined}
      title={translate(title)}
    />
  )

  const actions =
    isRecording && stepFinished ? (
      <span className={style.success} />
    ) : (
      <Fragment>
        {instruction}
        <Button
          variants={['centered', 'primary', 'lg']}
          disabled={disableInteraction}
          onClick={isRecording ? handleNext : onStart}
        >
          {translate(button)}
        </Button>
      </Fragment>
    )

  return (
    <Fragment>
      <ProgressBar
        stepFinished={stepFinished}
        stepNumber={stepNumber}
        totalSteps={totalSteps}
      />
      <div className={style.actions}>{actions}</div>
    </Fragment>
  )
}

export default memo(VideoLayer)
