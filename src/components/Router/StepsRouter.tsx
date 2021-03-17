import { h, Component, ComponentType } from 'preact'
import classNames from 'classnames'
import { sendScreen } from '../../Tracker'
import { wrapArray } from '~utils/array'
import NavigationBar from '../NavigationBar'
import theme from '../Theme/style.scss'
import { withFullScreenState } from '../FullScreen'

import type { TrackScreenCallback } from '~types/hocs'
import type { StepComponentProps, StepsRouterProps } from '~types/routers'

class StepsRouter extends Component<StepsRouterProps> {
  private container?: HTMLDivElement

  resetSdkFocus = () => this.container.focus()

  trackScreen: TrackScreenCallback = (screenNameHierarchy, properties = {}) => {
    const { step } = this.currentComponent()
    sendScreen([step.type, ...wrapArray(screenNameHierarchy)], {
      ...properties,
      ...step.options,
    })
  }

  currentComponent = () => this.props.componentsList[this.props.step]

  render = () => {
    const {
      back,
      cobrand,
      logoCobrand,
      disableNavigation,
      hideOnfidoLogo,
      isFullScreen,
      options: { mobileFlow, ...globalUserOptions },
      ...otherProps
    } = this.props

    const componentBlob = this.currentComponent()
    const CurrentComponent = componentBlob.component
    const options = componentBlob.step.options
    const passedProps: StepComponentProps = {
      ...options,
      ...globalUserOptions,
      ...otherProps,
      back,
      mobileFlow,
      resetSdkFocus: this.resetSdkFocus,
      trackScreen: this.trackScreen,
    }

    const stepId = `onfido-step${this.props.step}` // to trigger update in NavigationBar on step change

    // This prevents the logo, cobrand UI elements from appearing late
    const hideLogoLogic = mobileFlow
      ? hideOnfidoLogo
      : globalUserOptions.enterpriseFeatures?.hideOnfidoLogo && hideOnfidoLogo

    const textCobrandLogic = mobileFlow
      ? cobrand
      : globalUserOptions.enterpriseFeatures?.cobrand && cobrand

    const logoCobrandLogic = mobileFlow
      ? logoCobrand
      : globalUserOptions.enterpriseFeatures?.logoCobrand && logoCobrand

    const logoCobrandStyle = logoCobrandLogic
      ? { backgroundImage: `url(${logoCobrandLogic.src})` }
      : null

    return (
      //TODO: Wrap CurrentComponent in themeWrap HOC
      <div
        className={classNames(theme.step, {
          [theme.fullScreenStep]: isFullScreen,
          [theme.noLogo]: hideLogoLogic,
          [theme.textCobrandLogo]: textCobrandLogic,
          [theme.logoCobrandImage]: logoCobrand,
          [theme.defaultLogo]: !hideOnfidoLogo && !cobrand,
        })}
        tabIndex={-1}
        ref={(node) => (this.container = node)}
      >
        <NavigationBar
          id={stepId}
          back={back}
          disabled={disableNavigation}
          className={theme.navigationBar}
        />
        <div
          className={classNames(theme.content, {
            [theme.fullScreenContentWrapper]: isFullScreen,
            [theme.scrollableContent]: !isFullScreen,
          })}
        >
          <CurrentComponent {...passedProps} />
        </div>
        {!hideLogoLogic && (textCobrandLogic || logoCobrandLogic) ? (
          <div
            className={classNames({
              [theme.cobrandFooter]: textCobrandLogic || logoCobrandLogic,
            })}
          >
            {logoCobrandLogic ? (
              <div
                className={theme.logoCobrandImage}
                style={logoCobrandStyle}
              />
            ) : null}
            <div className={theme.cobrandLabel} aria-hidden="true">
              {textCobrandLogic ? (
                <div className={theme.cobrandText}>{textCobrandLogic.text}</div>
              ) : null}
              <div className={theme.poweredBy}>powered by</div>
            </div>
            <div className={theme.logo} />
          </div>
        ) : (
          <div className={theme.footer}>
            <div className={theme.logo} />
          </div>
        )}
      </div>
    )
  }
}

export default withFullScreenState<ComponentType<StepsRouterProps>>(StepsRouter)
