import watch from 'redux-watch'
import isEqual from 'deep-equal'

export const subscribeByWatching = (getState, subscribe) => (selector, changeCallback) => {
  const watcher = watch(()=>selector(getState()), null, isEqual)
  subscribe(watcher(changeCallback))
}
