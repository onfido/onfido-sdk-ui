import { h, FunctionComponent } from 'preact'
import { memo } from 'preact/compat'
import style from './style.scss'

type Props = {
  title?: string
}

const CaptureProgress: FunctionComponent<Props> = ({ title }) => (
  <div className={style.instructions}>
    {title && <span className={style.title}>{title}</span>}
    <span className={style.loading}>
      <span className={style.active} />
      <span className={style.background} />
    </span>
  </div>
)

export default memo(CaptureProgress)
