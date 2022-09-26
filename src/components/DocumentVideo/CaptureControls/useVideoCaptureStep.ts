import useCaptureStep from '../../utils/useCaptureStep'
import type { CaptureFlows, CaptureSteps } from '~types/docVideo'

const STEPS_BY_FLOW: Record<CaptureFlows, CaptureSteps[]> = {
  passport: ['intro', 'front'],
  cardId: ['intro', 'front', 'back'],
  paperId: ['intro', 'front', 'back'],
}

export type VideoCaptureStepActions =
  | 'showButton'
  | 'hideButton'
  | 'holdStill'
  | 'success'
  | 'submit'

export type VideoCaptureSteps = 'intro' | 'front' | 'back'

const useVideoCaptureStep = (
  captureFlow: 'passport' | 'cardId' | 'paperId'
) => {
  return useCaptureStep<VideoCaptureSteps, VideoCaptureStepActions>(
    STEPS_BY_FLOW[captureFlow],
    () => {
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
    },
    (captureStep) => {
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
  )
}

export default useVideoCaptureStep
