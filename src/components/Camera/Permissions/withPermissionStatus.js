import { h, Component } from 'preact'
import { checkIfCameraPermissionGranted } from 'components/utils'

const PERMISSION_DENIED = 'camera_permission_denied'

export default function (WrappedComponent) {
  return class PermissionStatus extends Component {
    state = {
      hasPermission: this.getPermissionDenied() === 'true' ? false : undefined,
    }

    componentDidMount = () => {
      checkIfCameraPermissionGranted(hasPermission => {
        if (hasPermission) {
          debugger;
          this.setState({ hasPermission })
        }
      })
    }

    getPermissionDenied = () =>
      window.localStorage.getItem(PERMISSION_DENIED)

    setPermissionDenied = () =>
      window.localStorage.setItem(PERMISSION_DENIED, 'true')

    clearPermissionDenied = () =>
      window.localStorage.removeItem(PERMISSION_DENIED)

    handleWebcamFailure = () => {
      this.props.onWebcamFailure()
      this.setState({ hasPermission: false })
      this.setPermissionDenied()
    }

    handleUserMedia = (...args) => {
      this.props.onUserMedia(...args)
      this.setState({ hasPermission: false })
      this.clearPermissionDenied()
    }

    render(props) {
      return (
        <WrappedComponent
          {...props}
        />
      )
    }
  }
}