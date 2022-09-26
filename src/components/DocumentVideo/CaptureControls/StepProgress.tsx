import { h, FunctionComponent } from 'preact'
import { memo } from 'preact/compat'

import { useLocales } from '~locales'
import style from './style.scss'

export type Props = {
  stepNumber?: number
  totalSteps: number
}

const StepProgress: FunctionComponent<Props> = ({
  stepNumber = 0,
  totalSteps,
}) => {
  const { parseTranslatedTags } = useLocales()

  if (totalSteps < 2 || stepNumber < 1) {
    return null
  }

  const stepStrings = parseTranslatedTags(
    'doc_video_capture.stepper',
    ({ type }) => {
      switch (type) {
        case 'step':
          return String(stepNumber)
        case 'total':
          return String(totalSteps)
        default:
          return ''
      }
    }
  )

  return <span className={style.progress}>{stepStrings}</span>
}

export default memo(StepProgress)
