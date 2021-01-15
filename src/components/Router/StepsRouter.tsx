import { h, Component, ComponentType } from 'preact'
import classNames from 'classnames'
import { sendScreen } from '../../Tracker'
import { wrapArray } from '~utils/array'
import NavigationBar from '../NavigationBar'
import theme from '../Theme/style.scss'
import { withFullScreenState } from '../FullScreen'

import type { FlowVariants } from '~types/commons'
import type { EnterpriseCobranding } from '~types/enterprise'
import type { DocumentTypes } from '~types/steps'
import type { SdkOptions } from '~types/sdk'
import type { ComponentStep } from './StepComponentMap'

type Props = {
  back: () => void
  changeFlowTo: (
    newFlow: FlowVariants,
    newStep?: number,
    excludeStepFromHistory?: boolean
  ) => void
  cobrand?: EnterpriseCobranding
  componentsList: ComponentStep[]
  disableNavigation: boolean
  documentType: DocumentTypes
  hideOnfidoLogo: boolean
  isFullScreen: boolean
  nextStep: () => void
  previousStep: () => void
  triggerOnError: (response: Record<string, unknown>) => void
  options: SdkOptions
  step: number
}

class StepsRouter extends Component<Props> {
  private container: Optional<HTMLDivElement>

  resetSdkFocus = () => this.container.focus()

  trackScreen = (
    screenNameHierarchy: string | string[],
    properties: Record<string, unknown> = {}
  ) => {
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
      disableNavigation,
      isFullScreen,
      hideOnfidoLogo,
      cobrand,
      options: { mobileFlow, ...globalUserOptions },
      ...otherProps
    } = this.props
    const componentBlob = this.currentComponent()
    const CurrentComponent = componentBlob.component
    const options = componentBlob.step.options
    const passedProps = {
      ...options,
      ...globalUserOptions,
      ...otherProps,
      mobileFlow,
      back,
    }
    const stepId = `onfido-step${this.props.step}` // to trigger update in NavigationBar on step change
    // This prevents the logo, cobrand UI elements from appearing late
    const hideLogoLogic = mobileFlow
      ? hideOnfidoLogo
      : globalUserOptions.enterpriseFeatures?.hideOnfidoLogo && hideOnfidoLogo
    const cobrandLogic = mobileFlow
      ? cobrand
      : globalUserOptions.enterpriseFeatures?.cobrand && cobrand
    return (
      //TODO: Wrap CurrentComponent in themeWrap HOC
      <div
        className={classNames(theme.step, {
          [theme.fullScreenStep]: isFullScreen,
          [theme.noLogo]: hideLogoLogic,
          [theme.cobrandLogo]: cobrandLogic,
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
          <CurrentComponent
            {...{
              ...passedProps,
              trackScreen: this.trackScreen,
              resetSdkFocus: this.resetSdkFocus,
            }}
          />
        </div>
        {!hideLogoLogic && cobrandLogic ? (
          <div className={classNames({ [theme.cobrandFooter]: cobrandLogic })}>
            <div className={theme.cobrandLabel} aria-hidden="true">
              <div className={theme.cobrandText}>{cobrandLogic.text}</div>
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
}

export default withFullScreenState<ComponentType<Props>>(StepsRouter)
