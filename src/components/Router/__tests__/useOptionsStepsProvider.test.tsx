import '@testing-library/jest-dom'
import { FunctionComponent, h } from 'preact'
import { renderHook } from '@testing-library/preact-hooks'
import { createOptionsStepsProvider } from '../useOptionsStepsProvider'
import { UserConsentContext } from '~contexts/useUserConsent'

const addUserConsentStepMock = jest.fn()

const wrapper: FunctionComponent = ({ children }) => (
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
)

describe('useOptionsSteps', () => {
  it('calls addUserConsentStep', async () => {
    renderHook(() => createOptionsStepsProvider({ steps: [] })(), {
      wrapper,
    })

    expect(addUserConsentStepMock).toHaveBeenCalled()
  })
})
