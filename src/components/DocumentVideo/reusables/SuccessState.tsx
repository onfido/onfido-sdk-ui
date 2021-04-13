import { h, FunctionComponent } from 'preact'
import { memo } from 'preact/compat'
import style from './style.scss'

type Props = {
  ariaLabel: string
}

const SuccessState: FunctionComponent<Props> = ({ ariaLabel }) => (
  <div className={style.instructions}>
    <span className={style.success} />
    <span className={style.successAria} aria-label={ariaLabel}>
      {ariaLabel}
    </span>
  </div>
)

export default memo(SuccessState)
