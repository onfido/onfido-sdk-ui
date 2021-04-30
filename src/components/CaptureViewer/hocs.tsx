import { h, Component, ComponentType } from 'preact'
import { blobToLossyBase64 } from '~utils/blob'
import { createObjectURL, revokeObjectURL } from '~utils/objectUrl'

import type { WithBlobPreviewProps } from '~types/hocs'

type WrappedPreviewProps = {
  base64?: string
  previewUrl?: string
}

export const withBlobPreviewUrl = <P extends WrappedPreviewProps>(
  WrappedComponent: ComponentType<P>
): ComponentType<P & WithBlobPreviewProps> => {
  type State = {
    previewUrl?: string
  }

  class BlobPreviewUrlComponent extends Component<
    P & WithBlobPreviewProps,
    State
  > {
    constructor(props: P & WithBlobPreviewProps) {
      super(props)

      const { blob } = props

      this.state = {
        previewUrl: this.createPreviewUrl(blob),
      }
    }

    createPreviewUrl = (blob?: Blob) =>
      blob ? createObjectURL(blob) : undefined

    updateBlobPreview(blob?: Blob) {
      this.revokePreviewURL()
      this.setState({ previewUrl: this.createPreviewUrl(blob) })
    }

    revokePreviewURL() {
      this.state.previewUrl && revokeObjectURL(this.state.previewUrl)
    }

    componentWillReceiveProps({ blob }: P & WithBlobPreviewProps) {
      if (this.props.blob !== blob) {
        this.updateBlobPreview(blob)
      }
    }

    componentWillUnmount() {
      this.revokePreviewURL()
    }

    render() {
      return (
        <WrappedComponent previewUrl={this.state.previewUrl} {...this.props} />
      )
    }
  }

  return BlobPreviewUrlComponent
}

export const withBlobBase64 = <P extends WrappedPreviewProps>(
  WrappedComponent: ComponentType<P>
): ComponentType<P & WithBlobPreviewProps> => {
  type State = {
    base64?: string
  }

  class BlobBase64Component extends Component<P & WithBlobPreviewProps, State> {
    constructor(props: P & WithBlobPreviewProps) {
      super(props)

      const { blob } = props
      this.updateBase64(blob)
    }

    updateBase64(blob?: Blob) {
      blob &&
        blobToLossyBase64(
          blob,
          (base64) => this.setState({ base64 }),
          () => console.error('An error occurred converting a blob to base64')
        )
    }

    componentWillReceiveProps({ blob }: P & WithBlobPreviewProps) {
      if (this.props.blob !== blob) {
        this.updateBase64(blob)
      }
    }

    render() {
      // don't show anything while we're loading the first base64 image
      if (!this.state.base64) return null
      return <WrappedComponent base64={this.state.base64} {...this.props} />
    }
  }

  return BlobBase64Component
}
