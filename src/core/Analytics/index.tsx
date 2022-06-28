import { h, Component, ComponentType } from 'preact'
import { cleanFalsy, wrapArray } from '~utils/array'

import type { TrackScreenCallback, WithTrackingProps } from '~types/hocs'
import type { LegacyTrackedEventNames } from '~types/tracker'
import { sendEvent } from 'Tracker'

export * from './cookie'

const screenNameHierarchyFormat = (
  screenNameHierarchy: string[]
): LegacyTrackedEventNames =>
  `screen_${cleanFalsy(screenNameHierarchy).join(
    '_'
  )}` as LegacyTrackedEventNames

export const sendScreen = (
  screenNameHierarchy: string[],
  properties?: Record<string, unknown>
): void => sendEvent(screenNameHierarchyFormat(screenNameHierarchy), properties)

export const appendToTracking = <P extends WithTrackingProps>(
  WrappedComponent: ComponentType<P>,
  ancestorScreenNameHierarchy?: string
): ComponentType<P> =>
  class TrackedComponent extends Component<P> {
    trackScreen: TrackScreenCallback = (
      screenNameHierarchy?: string | string[],
      ...others
    ) =>
      this.props.trackScreen(
        [
          ...(ancestorScreenNameHierarchy
            ? wrapArray(ancestorScreenNameHierarchy)
            : []),
          ...(screenNameHierarchy ? wrapArray(screenNameHierarchy) : []),
        ],
        ...others
      )

    render = () => (
      <WrappedComponent {...this.props} trackScreen={this.trackScreen} />
    )
  }

export const trackComponent = <P extends WithTrackingProps>(
  WrappedComponent: ComponentType<P>,
  screenName?: string
): ComponentType<P> =>
  class TrackedComponent extends Component<P> {
    componentDidMount() {
      this.props.trackScreen(screenName)
    }

    render = () => <WrappedComponent {...this.props} />
  }
