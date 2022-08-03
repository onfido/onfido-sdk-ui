import {
  Component,
  ComponentType,
  createRef,
  FunctionComponent,
  h,
} from 'preact'
import { useDispatch, useSelector } from 'react-redux'
import classNames from 'classnames'
import { setNavigationDisabled } from '../ReduxAppWrapper/store/actions/globals'
import { withFullScreenState, WithFullScreenStateProps } from '../FullScreen'
import { isDesktop } from '~utils'
import { localised } from '~locales'
import style from './style.scss'
import {
  WithLocalisedProps,
  WithNavigationDisabledActionProps,
  WithNavigationDisabledStateProps,
} from '~types/hocs'
import { GlobalActions, RootState } from '~types/redux'
import { Dispatch } from 'redux'

export function withNavigationDisabledState<P>(
  WrappedComponent: ComponentType<WithNavigationDisabledStateProps & P>
): ComponentType<P> {
  const WithNavigationDisabledStateComponent: FunctionComponent<P> = (
    props
  ) => {
    const state = useSelector<RootState, WithNavigationDisabledStateProps>(
      ({ globals: { isNavigationDisabled } }) => ({ isNavigationDisabled })
    )

    return <WrappedComponent {...props} {...state} />
  }

  return WithNavigationDisabledStateComponent
}

export function withNavigationDisableAction<P>(
  WrappedComponent: ComponentType<WithNavigationDisabledActionProps & P>
): ComponentType<P> {
  const WithNavigationDisableActionComponent: FunctionComponent<P> = (
    props
  ) => {
    const dispatch = useDispatch<Dispatch<GlobalActions>>()

    return (
      <WrappedComponent
        {...props}
        setNavigationDisabled={(value: boolean) => {
          dispatch(setNavigationDisabled(value))
        }}
      />
    )
  }

  return WithNavigationDisableActionComponent
}

type NavProps = {
  id?: string
  back?: () => void
  disabled?: boolean
  transparent?: boolean
  className?: string
}

type Props = NavProps & WithLocalisedProps & WithFullScreenStateProps

class NavigationBar extends Component<Props> {
  private backBtn = createRef<HTMLButtonElement>()

  componentDidUpdate(prevProps: Props) {
    const hasIdChanged = prevProps.id !== this.props.id
    if (this.backBtn.current && hasIdChanged) {
      this.backBtn.current.focus()
    }
  }

  render() {
    const {
      back,
      translate,
      disabled,
      isFullScreen,
      transparent,
      className,
    } = this.props
    return (
      <div
        className={classNames(className, style.navigation, {
          [style.transparent]: isFullScreen || transparent,
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
