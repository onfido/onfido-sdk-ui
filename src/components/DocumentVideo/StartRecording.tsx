import { h, Fragment, FunctionComponent } from 'preact'
import { useContext } from 'preact/compat'

import { LocaleContext } from '~locales'
import Button from '../Button'
import style from './style.scss'

export type Props = {
  disableInteraction?: boolean
  onClick: () => void
}

const StartRecording: FunctionComponent<Props> = ({
  children,
  disableInteraction = false,
  onClick,
}) => {
  const { translate } = useContext(LocaleContext)

  return (
    <Fragment>
      <div className={style.actions}>
        {children}
        <Button
          variants={['centered', 'primary', 'lg']}
          disabled={disableInteraction}
          onClick={onClick}
        >
          {translate('doc_video_capture.button_record_accessibility')}
        </Button>
      </div>
    </Fragment>
  )
}

export default StartRecording
