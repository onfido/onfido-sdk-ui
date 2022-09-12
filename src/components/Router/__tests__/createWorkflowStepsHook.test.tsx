import '@testing-library/jest-dom'
import { FunctionComponent, h } from 'preact'
import { renderHook } from '@testing-library/preact-hooks'
import { UserConsentContext } from '~contexts/useUserConsent'
import { createWorkflowStepsHook } from '../createWorkflowStepsHook'
import { StepConfig } from '~types/steps'
import MockedReduxProvider from '~jest/MockedReduxProvider'

const addUserConsentStepMock = jest.fn()

const wrapper: FunctionComponent = ({ children }) => (
  <MockedReduxProvider
    overrideGlobals={{
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

const renderWorkflowStepsHook = (steps: StepConfig[]) => {
  renderHook(
    () =>
      createWorkflowStepsHook({ token: '', workflowRunId: '', steps }, {})(),
    {
      wrapper,
    }
  )
}

describe('useWorkflowSteps', () => {
  it('calls addUserConsentStep', async () => {
    renderWorkflowStepsHook([{ type: 'welcome' }])
    expect(addUserConsentStepMock).toHaveBeenCalled()
  })

  it('does not call addUserConsentStep if there is no `welcome` step', () => {
    addUserConsentStepMock.mockReset()
    renderWorkflowStepsHook([{ type: 'document' }])
    expect(addUserConsentStepMock).not.toHaveBeenCalled()
  })
})
