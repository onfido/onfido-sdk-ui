import '@testing-library/jest-dom'
import { FunctionComponent, h } from 'preact'
import { renderHook } from '@testing-library/preact-hooks'
import { UserConsentContext } from '~contexts/useUserConsent'
import { createWorkflowStepsProvider } from '../useWorkflowStepsProvider'
import { StepConfig } from '~types/steps'

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

const renderWorkflowStepsProviderHook = (steps: StepConfig[]) =>
  renderHook(
    () =>
      createWorkflowStepsProvider(
        { token: '', workflowRunId: '', steps },
        {}
      )(),
    {
      wrapper,
    }
  )

describe('useWorkflowSteps', () => {
  it('calls addUserConsentStep', () => {
    renderWorkflowStepsProviderHook([{ type: 'welcome' }])
    expect(addUserConsentStepMock).toHaveBeenCalled()
  })

  it('does not call addUserConsentStep if there is no `welcome` step', () => {
    addUserConsentStepMock.mockReset()
    renderWorkflowStepsProviderHook([{ type: 'document' }])
    expect(addUserConsentStepMock).not.toHaveBeenCalled()
  })
})
