import { h, FunctionComponent } from 'preact'
import { withBlobPreviewUrl } from './hocs'
import style from './style.scss'

type CaptureVideoViewerProps = {
  ariaLabel: string
  previewUrl: string
}

const CaptureVideoViewer: FunctionComponent<CaptureVideoViewerProps> = ({
  ariaLabel,
  previewUrl,
}) => (
  <div className={style.videoWrapper}>
    <video
      aria-label={ariaLabel}
      className={style.video}
      src={previewUrl}
      controls
    />
  </div>
)

export default withBlobPreviewUrl(CaptureVideoViewer)
