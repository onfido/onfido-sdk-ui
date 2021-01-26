import { h, FunctionComponent } from 'preact'

import { noop } from '~utils/func'
import { localised } from '../../locales'
import Button from '../Button'
import style from './style.scss'

import type { WithLocalisedProps } from '~types/hocs'

export type RecordingProps = {
  children?: h.JSX.Element | h.JSX.Element[]
  disableInteraction?: boolean
  hasMoreSteps?: boolean
  onNext?: () => void
  onStop: () => void
}

type Props = RecordingProps & WithLocalisedProps

const Recording: FunctionComponent<Props> = ({
  children,
  disableInteraction = false,
  hasMoreSteps = false,
  onNext = noop,
  onStop,
  translate,
}) => {
  return (
    <div>
      <div className={style.actions}>
        {children}
        <Button
          variants={['centered', 'primary', 'lg']}
          disabled={disableInteraction}
          onClick={hasMoreSteps ? onNext : onStop}
        >
          {translate(
            hasMoreSteps
              ? 'doc_video_capture.button_primary_next'
              : 'doc_video_capture.button_stop_accessibility'
          )}
        </Button>
      </div>
    </div>
  )
}

export default localised(Recording)
