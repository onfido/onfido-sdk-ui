import { h } from 'preact'
import { withBlobPreviewUrl } from './hocs';
import style from './style.css'

const CaptureVideoViewer = ({ ariaLabel, previewUrl }) => (
  <div className={style.videoWrapper}>
    <video aria-label={ariaLabel} className={style.video} src={previewUrl} controls />
  </div>
)

export default withBlobPreviewUrl(CaptureVideoViewer)
