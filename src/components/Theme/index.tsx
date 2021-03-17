import { h, ComponentType, FunctionComponent } from 'preact'
import { connect, ConnectedProps } from 'react-redux'
import classNames from 'classnames'

import NavigationBar from '../NavigationBar'
import theme from './style.scss'

import type { WithThemeProps } from '~types/hocs'
import type { RootState } from '~types/redux'

const mapStateToProps = (state: RootState) => ({
  hideOnfidoLogo: state.globals.hideOnfidoLogo,
  cobrand: state.globals.cobrand,
  logoCobrand: state.globals.logoCobrand,
})

const withConnect = connect(mapStateToProps)

type Props = WithThemeProps & ConnectedProps<typeof withConnect>

const themeWrapped = (
  WrappedComponent: ComponentType<WithThemeProps>
): ComponentType<Props> => {
  const ThemedComponent: FunctionComponent<Props> = (props) => {
    const {
      back,
      disableNavigation = false,
      hideOnfidoLogo,
      cobrand,
      logoCobrand,
    } = props

    return (
      <div
        className={classNames(theme.step, {
          [theme.noLogo]: hideOnfidoLogo,
          [theme.textCobrandLogo]: cobrand,
          [theme.logoCobrandImage]: logoCobrand,
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
        {(cobrand || logoCobrand) && !hideOnfidoLogo ? (
          <div
            className={classNames({
              [theme.cobrandFooter]: cobrand || logoCobrand,
            })}
          >
            {logoCobrand ? <div className={theme.logoCobrandImage} /> : null}
            <div className={theme.cobrandLabel} aria-hidden="true">
              {cobrand ? (
                <div className={theme.cobrandText}>{cobrand.text}</div>
              ) : null}
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
): ComponentType<WithThemeProps & P> {
  return withConnect<ComponentType<WithThemeProps>>(
    themeWrapped(WrappedComponent)
  )
}
