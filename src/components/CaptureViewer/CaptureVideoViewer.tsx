import { h, FunctionComponent } from 'preact'
import classNames from 'classnames'
import { withBlobPreviewUrl } from './hocs'
import style from './style.scss'

type CaptureVideoViewerProps = {
  ariaLabel: string
  className?: string
  previewUrl?: string
}

const CaptureVideoViewer: FunctionComponent<CaptureVideoViewerProps> = ({
  ariaLabel,
  className,
  previewUrl,
}) => (
  <div className={classNames(style.videoWrapper, className)}>
    <video
      aria-label={ariaLabel}
      className={style.video}
      src={previewUrl}
      controls
    />
  </div>
)

export default withBlobPreviewUrl(CaptureVideoViewer)
