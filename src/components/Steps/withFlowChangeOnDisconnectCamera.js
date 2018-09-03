import { h, Component } from 'preact'
import { checkIfHasWebcam } from '../utils'

export default WrappedComponent =>
  class WithFlowChangeOnDisconnectCamera extends Component {

    componentWillUpdate(nextProps) {
      const { useWebcam, hasCamera, allowCrossDeviceFlow, changeFlowTo } = this.props
      if (useWebcam && nextProps.hasCamera !== hasCamera && !nextProps.hasCamera && allowCrossDeviceFlow) {
        changeFlowTo('crossDeviceSteps', 0, true)
      }
    }

    render() {
      return <WrappedComponent {...this.props} />
    }
  }