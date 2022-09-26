import { h, Component, ComponentType } from 'preact'
import { isDesktop } from '~utils'

import { ParsedError } from '~types/api'
import type {
  StepComponentDocumentProps,
  StepComponentFaceProps,
} from '~types/routers'

type CaptureComponentProps = StepComponentDocumentProps | StepComponentFaceProps

const buildError = (message: string): ParsedError => {
  console.warn(message)

  return {
    response: {
      message,
    },
    status: 499, // For placeholder purpose only
  }
}

const withCrossDeviceWhenNoCamera = <P extends CaptureComponentProps>(
  WrappedComponent: ComponentType<P>
): ComponentType<P> =>
  class WithCrossDeviceWhenNoCamera extends Component<P> {
    componentDidMount() {
      this.attemptForwardToCrossDevice()
    }

    componentDidUpdate(prevProps: P) {
      const propsWeCareAbout: Array<keyof P> = [
        'mobileFlow',
        'hasCamera',
        'allowCrossDeviceFlow',
        'forceCrossDevice',
      ]
      const propsHaveChanged = propsWeCareAbout.some(
        (propKey) => prevProps[propKey] !== this.props[propKey]
      )

      if (propsHaveChanged && this.props.allowCrossDeviceFlow) {
        this.attemptForwardToCrossDevice()
      }
    }

    attemptForwardToCrossDevice = () => {
      const {
        changeFlowTo,
        componentsList,
        forceCrossDevice,
        hasCamera,
        mobileFlow,
        photoCaptureFallback,
        requestedVariant,
        step,
        triggerOnError,
        uploadFallback,
      } = this.props
      const currentStep = componentsList[step].step.type
      const docVideoRequested =
        requestedVariant === 'video' && currentStep === 'document'
      const shouldSelfieFallbackBeDisabled =
        requestedVariant === 'video' &&
        currentStep === 'face' &&
        window.MediaRecorder == null &&
        !photoCaptureFallback
      const cameraRequiredButNoneDetected =
        (!hasCamera || shouldSelfieFallbackBeDisabled) &&
        (requestedVariant === 'video' ||
          currentStep === 'face' ||
          currentStep === 'activeVideo')

      if (
        cameraRequiredButNoneDetected ||
        forceCrossDevice ||
        // @TODO: remove this check when we fully support docVideo variant for both desktop & mobile web
        (docVideoRequested && !mobileFlow)
      ) {
        if (mobileFlow) {
          triggerOnError(
            buildError('Already on cross device flow but no camera detected')
          )
          return
        }

        if (mobileFlow && !uploadFallback) {
          triggerOnError(
            buildError(
              'Unable to complete the flow: upload fallback not allowed'
            )
          )
          return
        }

        if (!isDesktop) {
          if (cameraRequiredButNoneDetected) {
            triggerOnError(
              buildError(
                'Camera required: Either device has no camera or browser is unable to detect camera'
              )
            )
          }
          // The cross device option should not be available when the user is already using a mobile device
          return
        }

        const step = 0
        const excludeStepFromHistory = true
        changeFlowTo('crossDeviceSteps', step, excludeStepFromHistory)
      }
    }

    render() {
      return <WrappedComponent {...this.props} />
    }
  }

export default withCrossDeviceWhenNoCamera
