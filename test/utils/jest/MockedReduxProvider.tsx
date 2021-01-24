import { h, FunctionComponent } from 'preact'
import { Provider as ReduxProvider } from 'react-redux'
import configureMockStore from 'redux-mock-store'

import { initialState as captures } from 'components/ReduxAppWrapper/store/reducers/captures'
import { initialState as globals } from 'components/ReduxAppWrapper/store/reducers/globals'

type Props = {
  children?: h.JSX.Element
}

const MockedReduxProvider: FunctionComponent<Props> = ({ children }) => {
  const mockStore = configureMockStore()
  const mockState = {
    captures,
    globals,
  }
  const store = mockStore(mockState)

  return <ReduxProvider store={store}>{children}</ReduxProvider>
}

export default MockedReduxProvider
