import { h, FunctionComponent } from 'preact'
import { memo, useContext } from 'preact/compat'

import { LocaleContext } from '~locales'
import CaptureViewer from '../../CaptureViewer'
import style from './style.scss'

import type { DocumentCapture } from '~types/redux'

type Props = {
  capture: DocumentCapture
  previewing: boolean
}

const Content: FunctionComponent<Props> = ({ capture, previewing }) => {
  const { translate } = useContext(LocaleContext)

  if (previewing) {
    return (
      <div className={style.preview}>
        <span className={style.title}>
          {translate('doc_video_confirmation.preview_title')}
        </span>
        <CaptureViewer
          capture={capture}
          className={style.videoWrapper}
          method="document"
        />
      </div>
    )
  }

  return (
    <div className={style.content}>
      <span className={style.icon} />
      <span className={style.title}>
        {translate('doc_video_confirmation.title')}
      </span>
      <span className={style.body}>
        {translate('doc_video_confirmation.body')}
      </span>
    </div>
  )
}

export default memo(Content)
