import { h, FunctionComponent } from 'preact'
import style from './style.scss'

import type { RecordingStep } from '~types/docVideo'

type Props = {
  icon?: RecordingStep
  subTitle?: string
  title: string
}

const Instructions: FunctionComponent<Props> = ({ title }) => {
  return (
    <div className={style.instructions}>
      <span className={style.title}>{title}</span>
    </div>
  )
}

export default Instructions
