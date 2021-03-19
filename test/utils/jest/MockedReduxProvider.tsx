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

export type MockedStore = MockStoreEnhanced<RootState, CombinedActions>

type Props = {
  overrideCaptures?: Partial<CaptureState>
  overrideGlobals?: Partial<GlobalState>
  storeRef?: (store: MockedStore) => void
}

export const mockedReduxProps: ReduxProps = {
  actions: {
    /* common actions */
    reset: jest.fn(),
    /* `captures` actions */
    createCapture: jest.fn(),
    deleteCapture: jest.fn(),
    setCaptureMetadata: jest.fn(),
    /* `globals` actions */
    setIdDocumentType: jest.fn(),
    setIdDocumentIssuingCountry: jest.fn(),
    resetIdDocumentIssuingCountry: jest.fn(),
    setPoADocumentType: jest.fn(),
    setRoomId: jest.fn(),
    setSocket: jest.fn(),
    setClientSuccess: jest.fn(),
    setMobileNumber: jest.fn(),
    mobileConnected: jest.fn(),
    acceptTerms: jest.fn(),
    setNavigationDisabled: jest.fn(),
    setFullScreen: jest.fn(),
    setDeviceHasCameraSupport: jest.fn(),
    setUrls: jest.fn(),
    hideOnfidoLogo: jest.fn(),
    showCobranding: jest.fn(),
    showLogoCobranding: jest.fn(),
    setDecoupleFromAPI: jest.fn(),
    retryForImageQuality: jest.fn(),
    resetImageQualityRetries: jest.fn(),
  },
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
