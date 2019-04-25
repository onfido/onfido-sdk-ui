import { h } from 'preact'
import style from './style.css'

const Spinner = () => {
  return (
    <div className={style.loader}>
      <span className={style.accessibleSpinnerCopy} role="heading" aria-level="1">Loading...</span>
      <div className={style.inner}>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  )
}

export default Spinner
