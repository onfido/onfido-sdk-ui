import { h, FunctionComponent } from 'preact'
import { useContext } from 'preact/compat'

import { LocaleContext } from '~locales'
import { DOC_VIDEO_INSTRUCTIONS_MAPPING } from '~utils/localesMapping'
import Button from '../Button'
import Instructions from './Instructions'
import style from './style.scss'

export type Props = {
  disableInteraction?: boolean
  onClick: () => void
}

const StartRecording: FunctionComponent<Props> = ({
  disableInteraction = false,
  onClick,
}) => {
  const { translate } = useContext(LocaleContext)
  const title = translate(DOC_VIDEO_INSTRUCTIONS_MAPPING.video.intro.title)
  const subtitle = translate(
    DOC_VIDEO_INSTRUCTIONS_MAPPING.video.intro.subtitle
  )

  return (
    <div className={style.actions}>
      <Instructions title={title} subtitle={subtitle} />
      <Button
        variants={['centered', 'primary', 'lg']}
        disabled={disableInteraction}
        onClick={onClick}
      >
        {translate('doc_video_capture.button_record_accessibility')}
      </Button>
    </div>
  )
}

export default StartRecording
