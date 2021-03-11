import { h, ComponentType, FunctionComponent } from 'preact'
import { useSelector } from 'react-redux'
import classNames from 'classnames'

import NavigationBar from '../NavigationBar'
import theme from './style.scss'

import type { WithThemeProps } from '~types/hocs'
import type { EnterpriseCobranding } from '~types/enterprise'
import type { RootState } from '~types/redux'

const withTheme = (
  WrappedComponent: ComponentType<WithThemeProps>
): ComponentType<WithThemeProps> => {
  const ThemedComponent: FunctionComponent<WithThemeProps> = (props) => {
    const hideOnfidoLogo = useSelector<RootState, boolean | undefined>(
      (state) => state.globals.hideOnfidoLogo
    )
    const cobrand = useSelector<RootState, EnterpriseCobranding | undefined>(
      (state) => state.globals.cobrand
    )
    const { back, disableNavigation = false } = props

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

export default withTheme
