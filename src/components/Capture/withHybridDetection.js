import { h } from 'preact'
import { PureComponent } from 'preact-compat'
import { isHybrid } from '~utils'

export default WrappedComponent =>
  class WithHybridDetection extends PureComponent {
    state = {
      isHybrid: null,
    }

    async componentDidMount(){
      if (this.props.useLiveDocumentCapture === true) {
        this.setState({ isHybrid: await isHybrid('environment') })
      } else {
        this.setState({ isHybrid: false })
      }
    }

    render() {
      const { isHybrid } = this.state

      // while checking if the device is hybrid or not, don't render anything
      if (isHybrid === null) return null

      return <WrappedComponent {...this.props} isHybrid={this.state.isHybrid} />
    }
  }