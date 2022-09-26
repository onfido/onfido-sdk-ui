import { h, FunctionComponent } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import { createStore, Store } from 'redux'
import { Provider as ReduxProvider } from 'react-redux'
import reducer from './store/reducers'

import type { CombinedActions, RootState } from '~types/redux'

type StoreType = Store<RootState, CombinedActions>

export const reduxStore = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__
    ? window.__REDUX_DEVTOOLS_EXTENSION__()
    : undefined
)

const ReduxAppWrapper: FunctionComponent = ({ children }) => {
  const [store, setStore] = useState<StoreType | undefined>(undefined)

  useEffect(() => {
    setStore(reduxStore)
  }, [])

  if (store == null) {
    return null
  }

  return <ReduxProvider store={store}>{children}</ReduxProvider>
}

export default ReduxAppWrapper
