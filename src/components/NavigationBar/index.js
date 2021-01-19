import { h, Component } from 'preact'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { compose } from '~utils/func'
import { setNavigationDisabled } from '../ReduxAppWrapper/store/actions/globals'
import { withFullScreenState } from '../FullScreen'
import { isDesktop } from '~utils'
import { localised } from '../../locales'
import style from './style.scss'

export const withNavigationDisabledState = connect(
  ({ globals: { isNavigationDisabled } }) => ({ isNavigationDisabled })
)

export const withNavigationDisableAction = connect(null, (dispatch) => ({
  setNavigationDisabled: (value) => dispatch(setNavigationDisabled(value)),
}))

class NavigationBar extends Component {
  componentDidUpdate(prevProps) {
    const hasIdChanged = prevProps.id !== this.props.id
    if (this.backBtn && hasIdChanged) {
      this.backBtn.focus()
    }
  }

  render() {
    const { back, translate, disabled, isFullScreen, className } = this.props
    return (
      <div
        className={classNames(className, style.navigation, {
          [style.fullScreenNav]: isFullScreen,
        })}
      >
        <button
          type="button"
          aria-label={translate('generic.back')}
          ref={(node) => (this.backBtn = node)}
          onClick={back}
          className={classNames(style.back, {
            [style.disabled]: disabled,
            [style.backHoverDesktop]: isDesktop,
          })}
        >
          <span className={style.iconBack} />
          <span className={style.label} aria-hidden="true">
            {translate('generic.back')}
          </span>
        </button>
      </div>
    )
  }
}

export default compose(withFullScreenState, localised)(NavigationBar)
