import { h, Component } from 'preact'
import { isDesktop } from '~utils'

export default WrappedComponent =>
  class WithCrossDeviceWhenNoCamera extends Component {

    componentDidMount() {
      this.attemptForwardToCrossDevice()
    }

    componentDidUpdate(prevProps) {
      const propsWeCareAbout = ["currentStep", "mobileFlow", "hasCamera", "allowCrossDeviceFlow", "forceCrossDevice"]
      const propsHaveChanged = propsWeCareAbout.some(propKey => prevProps[propKey] !== this.props[propKey])

      if (propsHaveChanged && this.props.allowCrossDeviceFlow) {
        this.attemptForwardToCrossDevice()
      }
    }

    attemptForwardToCrossDevice = () => {
      const { hasCamera, forceCrossDevice, changeFlowTo, componentsList, step } = this.props
      const currentStep = componentsList[step]
      const cameraRequiredButNoneDetected = currentStep.step.type === 'face' && !hasCamera
      if (cameraRequiredButNoneDetected) {
        console.warn('Camera required: Either device has no camera or browser is unable to detect camera')
      }
      if (cameraRequiredButNoneDetected || forceCrossDevice) {
        if (this.props.mobileFlow) {
          console.warn('Already on cross device flow but no camera detected')
          return;
        }
        if (this.props.mobileFlow && !this.props.uploadFallback) {
          console.error('Unable to complete the flow: upload fallback not allowed')
          return;
        }
        if (!isDesktop) {
          // The cross device option should not be available when the user is already using a mobile device
          return;
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
