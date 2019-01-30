import { h, Component } from 'preact'

export default WrappedComponent =>
  class WithCrossDeviceWhenNoCamera extends Component {

    componentDidMount() {
      this.attemptForwardToCrossDevice()
    }

    componentWillUpdate(nextProps) {
      const propsWeCareAbout = ["useWebcam", "hasCamera", "allowCrossDeviceFlow"]
      const propsHaveChanged = propsWeCareAbout
        .some(propKey => nextProps[propKey] !== this.props[propKey])

      if (propsHaveChanged) {
        this.attemptForwardToCrossDevice(nextProps)
      }
    }

    attemptForwardToCrossDevice = (props = this.props) => {
      const { useWebcam, hasCamera, allowCrossDeviceFlow, changeFlowTo } = props
      const shouldAttempt = useWebcam && allowCrossDeviceFlow

      if (shouldAttempt && hasCamera === false) {
        changeFlowTo('crossDeviceSteps', 0, true)
      }
    }

    render() {
      return <WrappedComponent {...this.props} />
    }
  }
