import { h, Component } from 'preact'
import { blobToLossyBase64 } from '~utils/blob'

export const withBlobPreviewUrl = WrappedComponent => class extends Component {
  constructor (props) {
    super(props)
    const {blob} = props
    this.state = {
      previewUrl: this.createPreviewUrl(blob)
    }
  }

  createPreviewUrl = blob =>
    blob ? URL.createObjectURL(blob) : null

  updateBlobPreview(blob) {
    this.revokePreviewURL()
    this.setState({ previewUrl: this.createPreviewUrl(blob) })
  }

  revokePreviewURL(){
    URL.revokeObjectURL(this.state.previewUrl)
  }

  componentWillReceiveProps({blob}) {
    if (this.props.blob !== blob) this.updateBlobPreview(blob)
  }

  componentWillUnmount() {
    this.revokePreviewURL()
  }

  render() {
    return <WrappedComponent previewUrl={this.state.previewUrl} {...this.props} />
  }
}

export const withBlobBase64 = WrappedComponent => class extends Component {
  constructor (props) {
    super(props)
    const {blob} = props
    this.state = {
      base64: null
    }
    this.updateBase64(blob)
  }

  updateBase64(blob) {
    blobToLossyBase64(blob,
      base64 => this.setState({ base64 }),
      () => console.error("An error occurred converting a blob to base64"))
  }

  componentWillReceiveProps({blob}) {
    if (this.props.blob !== blob) this.updateBase64(blob)
  }

  render() {
    // don't show anything while we're loading the first base64 image
    if (!this.state.base64) return null;
    return <WrappedComponent base64={this.state.base64} {...this.props} />
  }
}
