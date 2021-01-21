import { h, ComponentType, FunctionComponent } from 'preact'
import { connect, ConnectedProps } from 'react-redux'
import classNames from 'classnames'

import NavigationBar from '../NavigationBar'
import theme from './style.scss'

import { RootState } from 'components/ReduxAppWrapper/store/reducers'

type ThemeWrappedProps = {
  back?: () => void
  disableNavigation?: boolean
}

const mapStateToProps = (state: RootState) => ({
  hideOnfidoLogo: state.globals.hideOnfidoLogo,
  cobrand: state.globals.cobrand,
})

const withConnect = connect(mapStateToProps)

type Props = ThemeWrappedProps & ConnectedProps<typeof withConnect>

const themeWrapped = (
  WrappedComponent: ComponentType<ThemeWrappedProps>
): ComponentType<Props> => {
  const ThemedComponent: FunctionComponent<Props> = (props) => {
    const { back, disableNavigation = false, hideOnfidoLogo, cobrand } = props

    return (
      <div
        className={classNames(theme.step, {
          [theme.noLogo]: hideOnfidoLogo,
          [theme.cobrandLogo]: cobrand,
          [theme.defaultLogo]: !hideOnfidoLogo && !cobrand,
        })}
      >
        <NavigationBar
          back={back}
          disabled={disableNavigation}
          className={theme.navigationBar}
        />
        <div className={theme.content}>
          <WrappedComponent {...props} />
        </div>
        {cobrand && !hideOnfidoLogo ? (
          <div className={classNames({ [theme.cobrandFooter]: cobrand })}>
            <div className={theme.cobrandLabel} aria-hidden="true">
              <div className={theme.cobrandText}>{cobrand.text}</div>
              <div className={theme.poweredBy}>powered by</div>
            </div>
            <div className={theme.logo} />
          </div>
        ) : (
          <div className={theme.footer} />
        )}
      </div>
    )
  }

  return ThemedComponent
}

export default function withTheme<P>(
  WrappedComponent: ComponentType<P>
): ComponentType<ThemeWrappedProps & P> {
  return withConnect<ComponentType<ThemeWrappedProps>>(
    themeWrapped(WrappedComponent)
  )
}
