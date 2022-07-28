import { useCallback } from 'preact/compat'
import useSdkConfigurationService from '~contexts/useSdkConfigurationService'
import { StepConfig } from '~types/steps'

const useActiveVideo = () => {
  const { experimental_features } = useSdkConfigurationService()

  const enabled = experimental_features?.motion_experiment?.enabled ?? false

  const addActiveVideoStep = useCallback(
    (steps: StepConfig[]) => {
      if (!enabled) {
        return steps
      }

      const faceIndex = steps.findIndex(({ type }) => type === 'face')
      const activeVideoIndex = steps.findIndex(
        ({ type }) => type === 'activeVideo'
      )

      if (faceIndex < 0 || activeVideoIndex >= 0) {
        return steps
      }

      const activeVideo: StepConfig = {
        type: 'activeVideo',
        edgeToEdgeContent: true,
      }

      return [
        ...steps.slice(0, faceIndex),
        activeVideo,
        ...steps.slice(faceIndex),
      ]
    },
    [enabled]
  )

  return { addActiveVideoStep }
}

export default useActiveVideo
