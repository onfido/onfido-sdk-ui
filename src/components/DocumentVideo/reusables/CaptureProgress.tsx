import { h, FunctionComponent } from 'preact'
import { memo } from 'preact/compat'
import style from './style.scss'

type Props = {
  duration?: number
  title?: string
}

const CaptureProgress: FunctionComponent<Props> = ({
  duration = 1000,
  title,
}) => (
  <div className={style.instructions}>
    {title && <span className={style.title}>{title}</span>}
    <span className={style.loading} role="progressbar" aria-live="assertive">
      <span
        className={style.active}
        style={{ animationDuration: `${duration}ms` }}
      />
      <span
        className={style.background}
        style={{ animationDuration: `${duration}ms` }}
      />
    </span>
  </div>
)

export default memo(CaptureProgress)
