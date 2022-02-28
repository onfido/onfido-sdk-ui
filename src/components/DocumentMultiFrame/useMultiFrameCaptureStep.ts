import useCaptureStep from '../utils/useCaptureStep'

export type MultiFrameCaptureStepActions =
  | 'placeholder'
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
            initialState: 'placeholder',
            states: {
              placeholder: {
                NEXT_RECORD_STATE: 'idle',
                RESET_RECORD_STATE: 'placeholder',
              },
              idle: {
                RESET_RECORD_STATE: 'placeholder',
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
