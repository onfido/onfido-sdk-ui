import { Instructions } from 'components/DocumentVideo/reusables'
import { h } from 'preact'
import { memo } from 'preact/compat'
import { useLocales } from '~locales'
import { DocumentSides } from '~types/commons'
import { MultiFrameCaptureStepActions } from './useMultiFrameCaptureStep'
import style from './CaptureInstructions.scss'
import theme from '../Theme/style.scss'

export type CaptureInstructionsProps = {
  side: DocumentSides
  recordState: MultiFrameCaptureStepActions
}

const CaptureInstructions = ({
  side,
  recordState,
}: CaptureInstructionsProps) => {
  const { translate } = useLocales()

  switch (recordState) {
    case 'idle':
    case 'placeholder':
      return (
        <div className={style.controls}>
          <div>
            {side === 'back' && (
              <span className={`${theme.icon} ${style.icon}`} />
            )}
            <Instructions
              title={translate(
                `doc_multi_frame_capture.instructions_title_${side}`
              )}
            />
          </div>
        </div>
      )
    default:
      return null
  }
}

export default memo(CaptureInstructions)
