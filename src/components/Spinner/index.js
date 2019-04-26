import { h } from 'preact'
import style from './style.css'
import { compose } from '../utils/func'
import {localised} from '../../locales'

const Spinner = ({translate}) => {
  return (
    <div className={style.loader}>
      <span className={style.accessibleSpinnerCopy} role="heading" aria-level="1">{translate('loading')}</span>
      <div className={style.inner}>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  )
}

export default compose(localised)(Spinner)
