import { h } from 'preact'
import { withBlobPreviewUrl } from './hocs';
import style from './style.css'

const CaptureVideoViewer = ({ previewUrl }) => (
  <div className={style.videoWrapper}>
    <video aria-label="Replay your recorded video" className={style.video} src={previewUrl} controls />
  </div>
)

export default withBlobPreviewUrl(CaptureVideoViewer)
