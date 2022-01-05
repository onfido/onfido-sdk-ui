import useCaptureStep from './useCaptureStep'

const useMultiFrameCaptureStep = () => {
  return useCaptureStep<'intro' | 'capture', 'idle' | 'scanning' | 'success'>(
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
                RESET_RECORD_STATE: 'scanning',
              },
            },
          }
      }
    }
  )
}

export default useMultiFrameCaptureStep
