import '@testing-library/jest-dom'
import { FunctionComponent, h } from 'preact'
import { renderHook } from '@testing-library/preact-hooks'
import { createOptionsStepsHook } from '../createOptionsStepsHook'
import { UserConsentContext } from '~contexts/useUserConsent'
import MockedReduxProvider from '~jest/MockedReduxProvider'
import { jwtToken } from '~jest/responses'

const addUserConsentStepMock = jest.fn()

const wrapper: FunctionComponent = ({ children }) => (
  <MockedReduxProvider
    overrideGlobals={{
      token: jwtToken,
      // @ts-ignore
      sdkConfiguration: {
        sdk_features: {
          enable_require_applicant_consents: true,
        },
      },
    }}
  >
    <UserConsentContext.Provider
      value={{
        consents: [
          {
            name: 'privacy_notices_read',
            granted: false,
            required: true,
          },
        ],
        enabled: true,
        updateConsents: Promise.resolve,
        addUserConsentStep: addUserConsentStepMock,
      }}
    >
      {children}
    </UserConsentContext.Provider>
  </MockedReduxProvider>
)

describe('useOptionsSteps', () => {
  it('calls addUserConsentStep', async () => {
    renderHook(() => createOptionsStepsHook({ steps: [] })(), {
      wrapper,
    })

    expect(addUserConsentStepMock).toHaveBeenCalledTimes(1)
  })
})
