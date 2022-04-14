import '@testing-library/jest-dom'
import { h } from 'preact'
import * as assert from 'assert'
import { renderHook } from '@testing-library/preact-hooks'
import { createOptionsStepsProvider } from '../useOptionsStepsProvider'
import { StepConfig } from '~types/steps'
import { UserConsentContext } from '~contexts/useUserConsent'
import { ApplicantConsentStatus } from '~types/api'
import { createWorkflowStepsProvider } from '../useWorkflowStepsProvider'

const defaultSteps: StepConfig[] = [{ type: 'welcome' }]

const defaultConsents: ApplicantConsentStatus[] = [
  {
    name: 'privacy_notices_read',
    granted: false,
    required: true,
  },
]

const verifyUserConsentStepIndex = (
  steps: StepConfig[] | undefined,
  index: number
) => {
  assert(steps)
  expect(steps.findIndex(({ type }) => type === 'userConsent')).toEqual(index)
}

// @ts-ignore
const wrapper = ({ children, enabled, consents, updateConsents }) => (
  <UserConsentContext.Provider value={{ enabled, consents, updateConsents }}>
    {children}
  </UserConsentContext.Provider>
)

// @ts-ignore
const renderWorkflowStepsProviderHook = (steps, enabled, consents) =>
  renderHook(
    () =>
      createWorkflowStepsProvider(
        { token: '', workflowRunId: '', steps },
        {}
      )(),
    {
      // @ts-ignore
      wrapper,
      initialProps: {
        enabled,
        consents,
      },
    }
  )

describe('useWorkflowSteps', () => {
  it('adds "userConsent" step if consents are required and not already granted', () => {
    const { result } = renderWorkflowStepsProviderHook(
      defaultSteps,
      true,
      defaultConsents
    )

    verifyUserConsentStepIndex(result.current?.steps, 1)
  })

  it('does not add "userConsent" step if Feature Flag is not enabled', async () => {
    const { result } = renderWorkflowStepsProviderHook(
      defaultSteps,
      false,
      defaultConsents
    )

    verifyUserConsentStepIndex(result.current?.steps, -1)
  })

  it('skips "userConsent" step if consents already granted', async () => {
    const { result } = renderWorkflowStepsProviderHook(defaultSteps, true, [
      {
        name: 'privacy_notices_read',
        granted: true,
        required: true,
      },
    ])

    expect(result.current?.steps[1].options?.skip).toBeTruthy()
  })

  it('skips "userConsent" step if consents not required', async () => {
    const { result } = renderWorkflowStepsProviderHook(defaultSteps, true, [
      {
        name: 'privacy_notices_read',
        granted: true,
        required: false,
      },
    ])

    expect(result.current?.steps[1].options?.skip).toBeTruthy()
  })
})
