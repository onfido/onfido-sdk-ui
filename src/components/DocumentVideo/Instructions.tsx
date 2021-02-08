import { h, FunctionComponent } from 'preact'
import cx from 'classnames'
import style from './style.scss'

import type { RecordingSteps } from '~types/docVideo'

type Props = {
  icon?: RecordingSteps
  subtitle?: string
  tiltMode?: 'left' | 'right'
  title: string
}

const Instructions: FunctionComponent<Props> = ({
  icon,
  subtitle,
  tiltMode,
  title,
}) => {
  return (
    <div className={style.instructions}>
      <span
        className={cx(style.icon, {
          [style.flipIcon]: icon === 'flip',
          [style.tiltIcon]: icon === 'tilt',
          [style.right]: icon === 'tilt' && tiltMode !== 'left', // default to be 'right'
          [style.left]: icon === 'tilt' && tiltMode === 'left',
        })}
      />
      <span className={style.title}>{title}</span>
      {subtitle && <span className={style.subtitle}>{subtitle}</span>}
    </div>
  )
}

export default Instructions
