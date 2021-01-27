import { h, FunctionComponent } from 'preact'
import { Provider as ReduxProvider } from 'react-redux'
import configureMockStore from 'redux-mock-store'

import { initialState as captures } from 'components/ReduxAppWrapper/store/reducers/captures'
import { initialState as globals } from 'components/ReduxAppWrapper/store/reducers/globals'
import type { RootState } from 'components/ReduxAppWrapper/store/reducers'

type Props = {
  children?: h.JSX.Element
  overrideState?: RootState
}

const MockedReduxProvider: FunctionComponent<Props> = ({
  children,
  overrideState,
}) => {
  const mockStore = configureMockStore()
  const mockState = {
    captures,
    globals,
    ...overrideState,
  }
  const store = mockStore(mockState)

  return <ReduxProvider store={store}>{children}</ReduxProvider>
}

export default MockedReduxProvider
