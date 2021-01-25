import { h, FunctionComponent } from 'preact'

import { localised } from '~locales'
import { DOC_VIDEO_INSTRUCTIONS_MAPPING } from '~utils/localesMapping'
import Button from '../Button'
import Instructions from './Instructions'
import style from './style.scss'

import type { WithLocalisedProps } from '~types/hocs'

type StartRecordingProps = {
  disableInteraction: boolean
  onClick: () => void
}

type Props = StartRecordingProps & WithLocalisedProps

const StartRecording: FunctionComponent<Props> = ({
  disableInteraction,
  onClick,
  translate,
}) => {
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

export default localised(StartRecording)
