import watch from 'redux-watch'
import isEqual from 'deep-equal'

export const subcribeByWatching = (getState, subscribe) => (selector, changeCallback) => {
  const watcher = watch(()=>selector(getState()), null, isEqual)
  subscribe(watcher(changeCallback))
}
