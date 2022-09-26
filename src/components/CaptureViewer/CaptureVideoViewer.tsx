import { h, FunctionComponent } from 'preact'
import classNames from 'classnames'
import { withBlobPreviewUrl } from './hocs'
import { trackException } from '../../Tracker'
import style from './style.scss'
import { WithTrackingProps } from '~types/hocs'
import { useRef } from 'preact/hooks'

type CaptureVideoViewerProps = {
  ariaLabel: string
  className?: string
  previewUrl?: string
  onVideoError: () => void
} & WithTrackingProps

const CaptureVideoViewer: FunctionComponent<CaptureVideoViewerProps> = ({
  ariaLabel,
  className,
  previewUrl,
  onVideoError,
  trackScreen,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)

  const onPlay = () => trackScreen('play_clicked')
  const onEnded = () => trackScreen('playback_finished')
  const onPause = () => {
    // onPause gets triggered just before onEnded too, the check prevents useles video_pause events
    if (
      videoRef &&
      videoRef.current &&
      videoRef.current?.currentTime < videoRef.current?.duration
    ) {
      trackScreen('pause_clicked')
    }
  }

  return (
    <div className={classNames(style.videoWrapper, className)}>
      <video
        ref={videoRef}
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
        onPlay={onPlay}
        onPause={onPause}
        onEnded={onEnded}
      />
    </div>
  )
}

export default withBlobPreviewUrl(CaptureVideoViewer)
