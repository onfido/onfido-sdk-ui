import { h, FunctionComponent } from 'preact'
import { memo } from 'preact/compat'
import style from './style.scss'

type Props = {
  subtitle?: string
  title: string
}

const Instructions: FunctionComponent<Props> = ({ subtitle, title }) => (
  <div className={style.instructions}>
    <span className={style.title}>{title}</span>
    {subtitle && <span className={style.subtitle}>{subtitle}</span>}
  </div>
)

export default memo(Instructions)
