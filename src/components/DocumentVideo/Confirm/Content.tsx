import { h, FunctionComponent } from 'preact'
import { memo } from 'preact/compat'

import { useLocales } from '~locales'
import CaptureViewer from '../../CaptureViewer'
import style from './style.scss'

import type { DocumentCapture } from '~types/redux'
import { WithTrackingProps } from '~types/hocs'

type Props = {
  capture?: DocumentCapture
  previewing: boolean
} & WithTrackingProps

const Content: FunctionComponent<Props> = ({
  capture,
  previewing,
  trackScreen,
}) => {
  const { translate } = useLocales()

  if (!capture) {
    return null
  }

  if (previewing) {
    return (
      <div className={style.preview}>
        <span className={style.title}>
          {translate('doc_video_confirmation.title')}
        </span>
        <CaptureViewer
          {...{ capture, trackScreen }}
          className={style.videoWrapper}
          method="document"
        />
      </div>
    )
  }

  return (
    <div className={style.content}>
      <span className={style.icon} />
      <span className={style.title}>{translate('outro.body')}</span>
      <span className={style.body}>{translate('video_confirmation.body')}</span>
    </div>
  )
}

export default memo(Content)
