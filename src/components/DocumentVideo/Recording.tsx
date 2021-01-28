import { h, FunctionComponent } from 'preact'
import { useContext } from 'preact/compat'

import { LocaleContext } from '../../locales'
import Button from '../Button'
import style from './style.scss'

export type Props = {
  children?: h.JSX.Element | h.JSX.Element[]
  disableInteraction?: boolean
  hasMoreSteps?: boolean
  onNext?: () => void
  onStop: () => void
}

const Recording: FunctionComponent<Props> = ({
  children,
  disableInteraction = false,
  hasMoreSteps = false,
  onNext,
  onStop,
}) => {
  const { translate } = useContext(LocaleContext)

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

export default Recording
