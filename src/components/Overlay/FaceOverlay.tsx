import { h, FunctionComponent } from 'preact'
import classNames from 'classnames'

import { useLocales } from '~locales'
import { withFullScreenState } from '../FullScreen'
import style from './style.scss'

type Props = {
  ariaLabel?: string
  isWithoutHole?: boolean
  video?: boolean
}

const FaceOverlay: FunctionComponent<Props> = ({
  ariaLabel,
  isWithoutHole,
  video,
}) => {
  const { translate } = useLocales()
  const defaultAriaLabel = video
    ? translate('video_capture.frame_accessibility')
    : translate('selfie_capture.frame_accessibility')

  return (
    <div
      data-onfido-qa="faceOverlay"
      className={classNames(style.faceOverlay, {
        [style.isWithoutHole]: isWithoutHole,
      })}
    >
      <span className={style.face} />
      <span className={style.ariaLabel}>{ariaLabel || defaultAriaLabel}</span>
    </div>
  )
}

export default withFullScreenState(FaceOverlay)
