import { h, FunctionComponent } from 'preact'
import classNames from 'classnames'

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
  disableInteraction = false,
  hasMoreSteps = false,
  onNext = noop,
  onStop,
  translate,
}) => (
  <div>
    <div className={style.actions}>
      {hasMoreSteps ? (
        <Button
          variants={['centered', 'primary', 'lg']}
          disabled={disableInteraction}
          onClick={onNext}
        >
          {translate('doc_video_capture.button_primary_next')}
        </Button>
      ) : (
        <button
          type="button"
          aria-label={translate('doc_video_capture.button_stop_accessibility')}
          disabled={disableInteraction}
          onClick={onStop}
          className={classNames(style.btn, style.stopRecording)}
        />
      )}
    </div>
  </div>
)

export default localised(Recording)
