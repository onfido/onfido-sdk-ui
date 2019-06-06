import { h } from 'preact'
import style from './style.css'
import { compose } from '~utils/func'
import {localised} from '../../locales'

const Spinner = ({translate}) => {
  return (
    <div className={style.loader} aria-live="assertive" tabindex="-1"
      autoFocus aria-label={translate('loading')}>
      <div className={style.inner}>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  )
}

export default compose(localised)(Spinner)
