import { h, FunctionComponent } from 'preact'
import classNames from 'classnames'
import { withBlobPreviewUrl } from './hocs'
import { trackException } from '../../Tracker'
import style from './style.scss'

type CaptureVideoViewerProps = {
  ariaLabel: string
  className?: string
  previewUrl?: string
  onVideoError: () => void
}

const CaptureVideoViewer: FunctionComponent<CaptureVideoViewerProps> = ({
  ariaLabel,
  className,
  previewUrl,
  onVideoError,
}) => (
  <div className={classNames(style.videoWrapper, className)}>
    <video
      aria-label={ariaLabel}
      className={style.video}
      src={previewUrl}
      onError={(event) => {
        const target = event.target as HTMLVideoElement
        const error = target.error as MediaError
        trackException(`${error.code} - ${error.message}`)
        onVideoError()
      }}
      controls
    />
  </div>
)

export default withBlobPreviewUrl(CaptureVideoViewer)
