import { useCallback } from 'preact/compat'
import useSdkConfigurationService from '~contexts/useSdkConfigurationService'
import { StepConfig } from '~types/steps'

const useActiveVideo = () => {
  const { experimental_features } = useSdkConfigurationService()

  const enabled = experimental_features?.motion_experiment?.enabled ?? false

  const replaceFaceWithActiveVideoStep = useCallback(
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
        //@ts-ignore
        original: steps[faceIndex],
      }

      return [
        ...steps.slice(0, faceIndex),
        activeVideo,
        ...steps.slice(faceIndex + 1),
      ]
    },
    [enabled]
  )

  return { replaceFaceWithActiveVideoStep }
}

export default useActiveVideo
