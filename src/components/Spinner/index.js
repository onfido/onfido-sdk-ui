import { h } from 'preact'
import style from './style.css'

const Spinner = () => {
  return (
    <div className={style.loader}>
      <div className={style.inner}>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  )
}

export default Spinner
