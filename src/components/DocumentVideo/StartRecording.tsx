import { h, FunctionComponent } from 'preact'
import { useContext } from 'preact/compat'

import { LocaleContext } from '~locales'
import Button from '../Button'
import ProgressBar from './ProgressBar'
import style from './style.scss'

export type Props = {
  disableInteraction?: boolean
  onClick: () => void
  totalSteps: number
}

const StartRecording: FunctionComponent<Props> = ({
  children,
  disableInteraction = false,
  onClick,
  totalSteps,
}) => {
  const { translate } = useContext(LocaleContext)

  return (
    <div className={style.actions}>
      <ProgressBar totalSteps={totalSteps} />
      {children}
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
