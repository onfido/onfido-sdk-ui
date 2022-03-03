import { h, Component, createRef } from 'preact'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { setNavigationDisabled } from '../ReduxAppWrapper/store/actions/globals'
import { withFullScreenState } from '../FullScreen'
import { isDesktop } from '~utils'
import { localised } from '~locales'
import style from './style.scss'
import { WithLocalisedProps } from '~types/hocs'
import { GlobalState } from '~types/redux'

export const withNavigationDisabledState = connect(
  ({ globals: { isNavigationDisabled } }: { globals: GlobalState }) => ({
    isNavigationDisabled,
  })
)

export const withNavigationDisableAction = connect(null, (dispatch) => ({
  setNavigationDisabled: (value: boolean) =>
    dispatch(setNavigationDisabled(value)),
}))

type NavProps = {
  id?: string
  back?: () => void
  disabled?: boolean
  isFullScreen?: boolean
  className?: string
}

type Props = NavProps & WithLocalisedProps

class NavigationBar extends Component<Props> {
  private backBtn = createRef<HTMLButtonElement>()

  componentDidUpdate(prevProps: Props) {
    const hasIdChanged = prevProps.id !== this.props.id
    if (this.backBtn.current && hasIdChanged) {
      this.backBtn.current.focus()
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
          ref={this.backBtn}
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

export default withFullScreenState(localised(NavigationBar))
