import { h, FunctionComponent } from 'preact'
import { Provider as ReduxProvider } from 'react-redux'
import configureMockStore, { MockStoreEnhanced } from 'redux-mock-store'

import { initialState as captures } from 'components/ReduxAppWrapper/store/reducers/captures'
import { initialState as globals } from 'components/ReduxAppWrapper/store/reducers/globals'
import type {
  CombinedActions,
  RootState,
  CaptureState,
  GlobalState,
} from '~types/redux'
import type { ReduxProps } from '~types/routers'
import { actions } from '../../../src/components/ReduxAppWrapper/store/actions'
import { ActionCreatorsMapObject } from 'redux'

export type MockedStore = MockStoreEnhanced<RootState, CombinedActions>

type Props = {
  overrideCaptures?: Partial<CaptureState>
  overrideGlobals?: Partial<GlobalState>
  storeRef?: (store: MockedStore) => void
}

const mockedActions: ActionCreatorsMapObject = {}

Object.keys(actions).forEach((key) => {
  mockedActions[key] = jest.fn()
})

export const mockedReduxProps: ReduxProps = {
  actions: mockedActions,
  captures,
  ...globals,
}

const MockedReduxProvider: FunctionComponent<Props> = ({
  children,
  overrideCaptures,
  overrideGlobals,
  storeRef,
}) => {
  const mockStore = configureMockStore<RootState, CombinedActions>()
  const mockState = {
    captures: { ...captures, ...overrideCaptures },
    globals: { ...globals, ...overrideGlobals },
  }
  const store = mockStore(mockState)
  storeRef && storeRef(store)

  return <ReduxProvider store={store}>{children}</ReduxProvider>
}

export default MockedReduxProvider
