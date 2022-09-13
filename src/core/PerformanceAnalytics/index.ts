import { NavigationCompleted, NavigationStarted } from './events/Navigation'
import { PerformanceAnalytics } from './PerformanceAnalytics'

const performanceAnalytics = new PerformanceAnalytics()

export default performanceAnalytics

performanceAnalytics.trackStart(
  new NavigationStarted('test', { origin: 'init' })
)

performanceAnalytics.trackEnd(
  new NavigationCompleted('test', { destination: 'end' })
)
