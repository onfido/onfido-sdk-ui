import { useEffect } from 'preact/compat'
import useStateMachine, { MachineSpec } from '~utils/useStateMachine'

import type { CaptureFlows, CaptureSteps, RecordState } from '~types/docVideo'

type CaptureStepActions = 'NEXT_CAPTURE_STEP' | 'RESET_CAPTURE_STEP'
type RecordStateActions = 'NEXT_RECORD_STATE' | 'RESET_RECORD_STATE'

type UseCaptureStepType = {
  nextStep: () => void
  nextRecordState: () => void
  restart: () => void
  recordState: RecordState
  captureStep: CaptureSteps
  stepNumber: number
  totalSteps: number
}

const getCaptureStepSpec = (
  captureFlow: CaptureFlows
): MachineSpec<CaptureSteps, CaptureStepActions> => {
  if (captureFlow === 'passport') {
    return {
      initialState: 'intro',
      states: {
        intro: {
          NEXT_CAPTURE_STEP: 'front',
        },
        front: {
          RESET_CAPTURE_STEP: 'intro',
        },
      },
    }
  }

  return {
    initialState: 'intro',
    states: {
      intro: {
        NEXT_CAPTURE_STEP: 'front',
      },
      front: {
        NEXT_CAPTURE_STEP: 'back',
        RESET_CAPTURE_STEP: 'intro',
      },
      back: {
        RESET_CAPTURE_STEP: 'intro',
      },
    },
  }
}

const getRecordStateSpec = (
  captureFlow: CaptureFlows,
  captureStep: CaptureSteps
): MachineSpec<RecordState, RecordStateActions> => {
  if (captureStep === 'intro') {
    return {
      initialState: 'showButton',
      states: {
        hideButton: {
          RESET_RECORD_STATE: 'showButton',
        },
        holdStill: {
          RESET_RECORD_STATE: 'showButton',
        },
        success: {
          RESET_RECORD_STATE: 'showButton',
        },
      },
    }
  }

  if (captureFlow === 'passport') {
    return {
      initialState: 'hideButton',
      states: {
        hideButton: {
          NEXT_RECORD_STATE: 'showButton',
        },
        showButton: {
          NEXT_RECORD_STATE: 'holdStill',
          RESET_RECORD_STATE: 'hideButton',
        },
        holdStill: {
          NEXT_RECORD_STATE: 'success',
          RESET_RECORD_STATE: 'hideButton',
        },
        success: {
          RESET_RECORD_STATE: 'hideButton',
        },
      },
    }
  }

  return {
    initialState: 'hideButton',
    states: {
      hideButton: {
        NEXT_RECORD_STATE: 'showButton',
      },
      showButton: {
        NEXT_RECORD_STATE: 'success',
        RESET_RECORD_STATE: 'hideButton',
      },
      success: {
        RESET_RECORD_STATE: 'hideButton',
      },
    },
  }
}

const STEPS_BY_FLOW: Record<CaptureFlows, CaptureSteps[]> = {
  passport: ['intro', 'front'],
  cardId: ['intro', 'front', 'back'],
  paperId: ['intro', 'front', 'back'],
}

const useCaptureStep = (captureFlow: CaptureFlows): UseCaptureStepType => {
  const [captureStep, dispatchCaptureStep] = useStateMachine(
    getCaptureStepSpec(captureFlow)
  )

  const [recordState, dispatchRecordState] = useStateMachine(
    getRecordStateSpec(captureFlow, captureStep)
  )

  useEffect(() => {
    dispatchRecordState('RESET_RECORD_STATE')
  }, [captureStep]) // eslint-disable-line react-hooks/exhaustive-deps

  const possibleSteps = STEPS_BY_FLOW[captureFlow]
  const totalSteps = possibleSteps.length - 1
  const stepNumber = possibleSteps.indexOf(captureStep)

  return {
    captureStep,
    nextRecordState: () => dispatchRecordState('NEXT_RECORD_STATE'),
    nextStep: () => dispatchCaptureStep('NEXT_CAPTURE_STEP'),
    recordState,
    restart: () => dispatchCaptureStep('RESET_CAPTURE_STEP'),
    stepNumber,
    totalSteps,
  }
}

export default useCaptureStep
