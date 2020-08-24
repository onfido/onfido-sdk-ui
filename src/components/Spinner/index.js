import { h } from 'preact'
import { compose } from '~utils/func'
import { localised } from '../../locales'
import style from './style.scss'

const Spinner = ({ translate }) => {
  return (
    <div
      className={style.loader}
      aria-live="assertive"
      tabIndex="-1"
      autoFocus
      aria-label={translate('loading')}
    >
      <div className={style.inner}>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  )
}

export default compose(localised)(Spinner)
