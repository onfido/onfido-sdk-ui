import { h, Component } from 'preact'
import classNames from 'classnames'
import { sendScreen } from '../../Tracker'
import { wrapArray } from '~utils/array'
import NavigationBar from '../NavigationBar'
import theme from '../Theme/style.scss'
import { withFullScreenState } from '../FullScreen'
import { ContainerDimensionsProvider } from '~contexts/useContainerDimensions'
import Spinner from '../Spinner'
import type { TrackScreenCallback } from '~types/hocs'
import type { StepComponentProps, StepsRouterProps } from '~types/routers'

class StepsRouter extends Component<StepsRouterProps> {
  private container?: HTMLDivElement

  resetSdkFocus = () => this.container?.focus()

  componentDidUpdate(prevProps, nextProps) {
    console.log('[StepsRouter]', prevProps, nextProps)
  }

  trackScreen: TrackScreenCallback = (screenNameHierarchy, properties = {}) => {
    const { step } = this.currentComponent()
    sendScreen(
      [
        step.type,
        ...(screenNameHierarchy ? wrapArray(screenNameHierarchy) : []),
      ],
      {
        ...properties,
      }
    )
  }

  currentComponent = () => {
    const { componentsList, step } = this.props
    return componentsList[step]
  }

  render = () => {
    const {
      back,
      cobrand,
      logoCobrand,
      disableNavigation,
      hideOnfidoLogo,
      isFullScreen,
      isLoadingStep,
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

    // FIXME: Clean up this hack (see 163ed120, 10d9de1a, and e56fada0)
    const edgeToEdgeContent = false

    return (
      //TODO: Wrap CurrentComponent in themeWrap HOC
      <ContainerDimensionsProvider>
        <div
          className={classNames(theme.step, {
            [theme.fullScreenStep]: isFullScreen,
            [theme.noLogo]: hideLogoLogic,
            [theme.logoCobrandImage]: logoCobrand,
            [theme.onfidoCobrandLogo]: textCobrandLogic || logoCobrand,
            [theme.defaultLogo]: !hideOnfidoLogo && !cobrand,
          })}
          tabIndex={-1}
          ref={(node) => node && (this.container = node)}
        >
          <NavigationBar
            id={stepId}
            back={back}
            disabled={disableNavigation}
            transparent={edgeToEdgeContent}
            className={theme.navigationBar}
          />
          <div
            key={stepId}
            className={classNames(theme.content, {
              [theme.fullScreenContentWrapper]: isFullScreen,
              [theme.scrollableContent]: !isFullScreen,
              [theme.edgeToEdgeContent]: edgeToEdgeContent,
            })}
          >
            {isLoadingStep ? (
              <Spinner />
            ) : (
              <CurrentComponent {...passedProps} />
            )}
          </div>
          {!edgeToEdgeContent ? (
            !hideLogoLogic && (textCobrandLogic || logoCobrandLogic) ? (
              <div
                className={classNames({
                  [theme.cobrandFooter]: textCobrandLogic || logoCobrandLogic,
                })}
              >
                {logoCobrandLogic ? (
                  <div className={theme.logoCobrandImage} />
                ) : null}
                <div className={theme.cobrandLabel} aria-hidden="true">
                  {textCobrandLogic ? (
                    <div className={theme.cobrandText}>
                      {textCobrandLogic.text}
                    </div>
                  ) : null}
                  <div className={theme.poweredBy}>powered by</div>
                </div>
                <div className={theme.logo} />
              </div>
            ) : (
              <div className={theme.footer}>
                <div className={theme.logo} />
              </div>
            )
          ) : null}
        </div>
      </ContainerDimensionsProvider>
    )
  }
}

export default withFullScreenState(StepsRouter)
