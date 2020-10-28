import { h } from 'preact'
import { withBlobPreviewUrl } from './hocs'
import style from './style.scss'

const CaptureVideoViewer = ({ ariaLabel, previewUrl, snapshotsVideoUrl }) => {
  const url = snapshotsVideoUrl ? snapshotsVideoUrl : previewUrl
  return (
    <div className={style.videoWrapper}>
      <video
        aria-label={ariaLabel}
        className={style.video}
        src={url}
        controls
      />
      {/* {temporarily add this link to preview video as safari does not support webm playback} */}
      <a href={url} download="output.webm">
        Download video to preview
      </a>
    </div>
  )
}

export default withBlobPreviewUrl(CaptureVideoViewer)
