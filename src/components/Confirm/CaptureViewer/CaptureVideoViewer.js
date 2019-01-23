import { h } from 'preact'
import { withBlobPreviewUrl } from './hocs';
import style from './style.css'

const CaptureVideoViewer = ({ previewUrl }) => (
  <div className={style.videoWrapper}>
    <video className={style.video} src={previewUrl} controls />
  </div>
)

export default withBlobPreviewUrl(CaptureVideoViewer)
