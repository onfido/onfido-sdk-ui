import { h, Component } from 'preact'
import { compose } from '~utils/func'
import { localised } from '../../locales'
import style from './style.scss'

class Spinner extends Component {
  componentDidUpdate() {
    // element.focus() is more reliable than `autoFocus` for accessibility focus management
    this.container && this.container.focus()
  }

  render = ({ translate }) => (
    <div
      className={style.loader}
      aria-live="assertive"
      tabIndex="-1"
      // role="progressbar" fixes issues on iOS where the aria-live="assertive" is not announced
      role="progressbar"
      ref={(ref) => (this.container = ref)}
      aria-label={translate('generic.loading')}
    >
      <div className={style.inner}>
        <div />
        <div />
        <div />
      </div>
    </div>
  )
}

export default compose(localised)(Spinner)
