import { h, FunctionComponent } from 'preact'
import cx from 'classnames'
import style from './style.scss'

import type { CaptureSteps, TiltModes } from '~types/docVideo'

type Props = {
  icon?: CaptureSteps
  subtitle?: string
  tiltMode?: TiltModes
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
          [style.backIcon]: icon === 'back',
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
