import { h, Component } from 'preact'
import { Link } from 'preact-router'
import theme from '../../style/refactor.css'
import style from './style.css'

const ActionBar = (props) => {
  const firstStep = (props.step < 2 || !props.step)
  return (
    <div className={`${theme.actions} ${style.base}`}>
      {!firstStep && <Link
        href={props.prevLink}
        className={style.btn}>
          <span>&larr;&nbsp;Back</span>
      </Link> || <span />}
      <a
        rel='modal:close'
        className={style.btn}
      >
        × Close
      </a>
    </div>
  )
}


export default ActionBar
