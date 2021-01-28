import { h, FunctionComponent } from 'preact'
import { Provider as ReduxProvider } from 'react-redux'
import configureMockStore from 'redux-mock-store'

import type { ReduxProps } from 'components/App/withConnect'
import { initialState as captures } from 'components/ReduxAppWrapper/store/reducers/captures'
import { initialState as globals } from 'components/ReduxAppWrapper/store/reducers/globals'
import type { GlobalState } from '~types/redux'

type Props = {
  children?: h.JSX.Element
  overrideGlobals?: Partial<GlobalState>
}

export const reduxProps: ReduxProps = {
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
    retryForImageQuality: jest.fn(),
    resetImageQualityRetries: jest.fn(),
  },
  captures,
  ...globals,
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
