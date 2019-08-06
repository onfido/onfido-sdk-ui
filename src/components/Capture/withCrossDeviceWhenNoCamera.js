import { h, Component } from 'preact'

export default WrappedComponent =>
  class WithCrossDeviceWhenNoCamera extends Component {

    componentDidMount() {
      this.attemptForwardToCrossDevice()
    }

    componentDidUpdate(prevProps) {
      const propsWeCareAbout = ["currentStep", "hasCamera", "allowCrossDeviceFlow", "forceCrossDevice"]
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
        changeFlowTo('crossDeviceSteps', 0, true)
      }
    }

    render() {
      return <WrappedComponent {...this.props} />
    }
  }
