import { h, Component } from 'preact'
import { compose } from '~utils/func'
import { localised } from '../../locales'
import style from './style.scss'

class Spinner extends Component {
  componentDidUpdate() {
    this.container && this.container.focus()
  }

  render = ({ translate }) => (
    <div
      className={style.loader}
      aria-live="assertive"
      tabIndex="-1"
      aria-label={translate('loading')}
      role="progressbar"
      ref={(ref) => (this.container = ref)}
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
