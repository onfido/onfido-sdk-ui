import { h, FunctionComponent, Fragment } from 'preact'
import { memo, useCallback, useEffect, useState } from 'preact/compat'

import { useLocales } from '~locales'
import Button from '../Button'
import DocumentOverlay, {
  calculateHollowRect,
} from '../Overlay/DocumentOverlay'
import Instructions from './Instructions'
import StepProgress from './StepProgress'
import style from './style.scss'

import type { DocumentTypes } from '~types/steps'
import type { DocInstructionLocale } from '~utils/localesMapping'
import type { VideoLayerProps } from '../VideoCapture'

export type Props = {
  documentType: DocumentTypes
  instructionKeys: DocInstructionLocale[]
  onNext: () => void
  onSubmit: () => void
  stepNumber: number
  totalSteps: number
} & VideoLayerProps

const VISIBLE_BUTTON_TIMEOUT = 3000
const SUCCESS_STATE_TIMEOUT = 2000
const SUCCESS_STATE_VIBRATION = 500

const VideoLayer: FunctionComponent<Props> = ({
  disableInteraction,
  documentType,
  instructionKeys,
  isRecording,
  onNext,
  onStart,
  onStop,
  onSubmit,
  stepNumber,
  totalSteps,
}) => {
  const [buttonVisible, setButtonVisible] = useState(false)
  const [stepFinished, setStepFinished] = useState(false)
  const { translate } = useLocales()

  useEffect(() => {
    if (stepNumber === 0) {
      setButtonVisible(true)
      return
    }

    setButtonVisible(false)
    setTimeout(() => setButtonVisible(true), VISIBLE_BUTTON_TIMEOUT)
  }, [stepNumber])

  useEffect(() => {
    if (stepFinished) {
      navigator.vibrate(SUCCESS_STATE_VIBRATION)
      setButtonVisible(false)
    }
  }, [stepFinished])

  const handleNext = useCallback(() => {
    if (stepNumber === 0) {
      console.warn('handleNext is supposed to be called after intro step')
      return
    }

    setStepFinished(true)

    if (stepNumber >= totalSteps) {
      onStop()
    }

    setTimeout(() => {
      if (stepNumber >= totalSteps) {
        onSubmit()
        return
      }

      onNext()
      setStepFinished(false)
    }, SUCCESS_STATE_TIMEOUT)
  }, [stepNumber, totalSteps, onNext, onStop, onSubmit])

  const { title, subtitle, button } = instructionKeys[stepNumber]

  const instruction = (
    <Instructions
      subtitle={subtitle ? translate(subtitle) : undefined}
      title={translate(title)}
    />
  )

  const action = (
    <Button
      variants={['centered', 'primary', 'lg']}
      disabled={disableInteraction}
      onClick={isRecording ? handleNext : onStart}
    >
      {translate(button)}
    </Button>
  )

  const renderItems = useCallback(() => {
    if (stepFinished) {
      return (
        <div className={style.instructions}>
          <span className={style.success} />
        </div>
      )
    }

    return (
      <Fragment>
        {instruction}
        {buttonVisible ? action : <div className={style.buttonPlaceholder} />}
      </Fragment>
    )
  }, [action, buttonVisible, instruction, stepFinished])

  const hollowRect = calculateHollowRect(documentType, 0.5)

  return (
    <Fragment>
      <DocumentOverlay
        marginBottom={0.5}
        type={documentType}
        withPlaceholder={stepNumber === 0}
      />
      <div className={style.controls} style={{ top: hollowRect.bottom }}>
        <StepProgress stepNumber={stepNumber} totalSteps={totalSteps} />
        {renderItems()}
      </div>
    </Fragment>
  )
}

export default memo(VideoLayer)
