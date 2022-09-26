import { h, ComponentType, FunctionComponent } from 'preact'
import { useSelector } from 'react-redux'
import classNames from 'classnames'

import NavigationBar from '../NavigationBar'
import theme from './style.scss'

import type { WithThemeProps } from '~types/hocs'
import type {
  EnterpriseCobranding,
  EnterpriseLogoCobranding,
} from '~types/enterprise'
import type { RootState } from '~types/redux'

const withTheme = <P extends unknown>(
  WrappedComponent: ComponentType<P>
): ComponentType<WithThemeProps & P> => {
  const ThemedComponent: FunctionComponent<WithThemeProps & P> = (props) => {
    const hideOnfidoLogo = useSelector<RootState, boolean | undefined>(
      (state) => state.globals.hideOnfidoLogo
    )
    const cobrand = useSelector<RootState, EnterpriseCobranding | undefined>(
      (state) => state.globals.cobrand
    )
    const logoCobrand = useSelector<
      RootState,
      EnterpriseLogoCobranding | undefined
    >((state) => state.globals.logoCobrand)

    const { back, disableNavigation = false } = props

    return (
      <div
        className={classNames(theme.step, {
          [theme.noLogo]: hideOnfidoLogo,
          [theme.logoCobrandImage]: logoCobrand,
          [theme.onfidoCobrandLogo]: cobrand || logoCobrand,
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

export default withTheme
