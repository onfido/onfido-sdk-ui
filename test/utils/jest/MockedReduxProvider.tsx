import { h, FunctionComponent } from 'preact'
import { Provider as ReduxProvider } from 'react-redux'
import configureMockStore from 'redux-mock-store'

import { initialState as captures } from 'components/ReduxAppWrapper/store/reducers/captures'
import { initialState as globals } from 'components/ReduxAppWrapper/store/reducers/globals'
import type { GlobalState } from '~types/redux'

type Props = {
  children?: h.JSX.Element
  overrideGlobals?: Partial<GlobalState>
}

const MockedReduxProvider: FunctionComponent<Props> = ({
  children,
  overrideGlobals,
}) => {
  const mockStore = configureMockStore()
  const mockState = {
    captures,
    globals: { ...globals, ...overrideGlobals },
  }
  const store = mockStore(mockState)

  return <ReduxProvider store={store}>{children}</ReduxProvider>
}

export default MockedReduxProvider
