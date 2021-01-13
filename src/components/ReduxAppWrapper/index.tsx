import { h, FunctionComponent, VNode } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import { createStore, Store } from 'redux'
import { Provider as ReduxProvider } from 'react-redux'
import reducer, { RootState } from './store/reducers'
import type { CaptureActions, GlobalActions } from './types'

type Props = {
  children: VNode
}

type StoreType = Store<RootState, CaptureActions | GlobalActions>

const ReduxAppWrapper: FunctionComponent<Props> = ({ children }) => {
  const [store, setStore] = useState<StoreType>(null)

  useEffect(() => {
    const newStore = createStore(
      reducer,
      window.__REDUX_DEVTOOLS_EXTENSION__
        ? window.__REDUX_DEVTOOLS_EXTENSION__()
        : undefined
    )

    setStore(newStore)
  }, [])

  if (store == null) {
    return null
  }

  return <ReduxProvider store={store}>{children}</ReduxProvider>
}

export default ReduxAppWrapper
