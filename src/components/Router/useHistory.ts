import { useCallback, useEffect, useMemo, useRef } from 'preact/hooks'
import {
  createBrowserHistory,
  createMemoryHistory,
  LocationListener,
  MemoryHistory,
  History,
} from 'history'
import { HistoryLocationState } from '~types/routers'

export const useHistory = (
  listener: LocationListener<HistoryLocationState>,
  useMemoryHistory = false
) => {
  const history:
    | MemoryHistory<HistoryLocationState>
    | History<HistoryLocationState> = useMemo(
    () => (useMemoryHistory ? createMemoryHistory() : createBrowserHistory()),
    [useMemoryHistory]
  )

  const listenerRef = useRef<LocationListener<HistoryLocationState>>()

  useEffect(() => {
    listenerRef.current = listener
  }, [listener])

  useEffect(() => {
    return history.listen((location, action) => {
      if (location.state && listenerRef.current) {
        listenerRef.current(location, action)
      }
    })
  }, [history])

  const push = useCallback(
    (state: HistoryLocationState) => {
      const path = `${location.pathname}${location.search}${location.hash}`
      history.push(path, state)
    },
    [history]
  )

  const back = useCallback(() => history.goBack(), [history])

  const forward = useCallback(() => history.goForward(), [history])

  return { push, back, forward }
}
