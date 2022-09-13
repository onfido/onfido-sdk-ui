import { PerformanceEvent } from '../PerformanceEvent'

interface NavigationStartedProps {
  source_screen: string // screen name
}

export class NavigationStarted extends PerformanceEvent<NavigationStartedProps> {
  public eventName = 'SCREEN_LOAD'
}

interface NavigationCompletedProps {
  destination_screen: string // screen name
}

export class NavigationCompleted extends PerformanceEvent<NavigationCompletedProps> {
  public eventName = 'SCREEN_LOAD'
}
