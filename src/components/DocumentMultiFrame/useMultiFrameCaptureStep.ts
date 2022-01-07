import useCaptureStep from './useCaptureStep'

export type MultiFrameCaptureStepActions =
  | 'idle'
  | 'scanning'
  | 'success'
  | 'submit'

export type MultiFrameCaptureSteps = 'intro' | 'capture'

const useMultiFrameCaptureStep = () => {
  return useCaptureStep<MultiFrameCaptureSteps, MultiFrameCaptureStepActions>(
    ['intro', 'capture'],
    () => {
      return {
        initialState: 'intro',
        states: {
          intro: {
            NEXT_CAPTURE_STEP: 'capture',
          },
          capture: {
            RESET_CAPTURE_STEP: 'intro',
          },
        },
      }
    },
    (captureStep) => {
      switch (captureStep) {
        case 'intro':
          return {
            initialState: 'idle',
            states: {
              idle: {
                RESET_RECORD_STATE: 'idle',
              },
            },
          }
        case 'capture':
          return {
            initialState: 'scanning',
            states: {
              scanning: {
                NEXT_RECORD_STATE: 'success',
                RESET_RECORD_STATE: 'scanning',
              },
              success: {
                NEXT_RECORD_STATE: 'submit',
                RESET_RECORD_STATE: 'scanning',
              },
              submit: {
                RESET_RECORD_STATE: 'scanning',
              },
            },
          }
      }
    }
  )
}

export default useMultiFrameCaptureStep
