import '@testing-library/jest-dom'
import { h } from 'preact'
import * as assert from 'assert'
import { renderHook } from '@testing-library/preact-hooks'
import { createOptionsStepsProvider } from '../useOptionsStepsProvider'
import { StepConfig } from '~types/steps'
import { UserConsentContext } from '~contexts/useUserConsent'
import { ApplicantConsentStatus } from '~types/api'

const defaultSteps: StepConfig[] = [{ type: 'document' }]

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
const renderOptionsStepsProviderHook = (steps, enabled, consents) =>
  renderHook(() => createOptionsStepsProvider({ steps })(), {
    // @ts-ignore
    wrapper,
    initialProps: {
      enabled,
      consents,
    },
  })

describe('useOptionsSteps', () => {
  it('adds "userConsent" step if consents are required and not already granted', () => {
    const { result } = renderOptionsStepsProviderHook(
      defaultSteps,
      true,
      defaultConsents
    )

    verifyUserConsentStepIndex(result.current?.steps, 0)
  })

  it('adds "userConsent" after "welcome" step', () => {
    const { result } = renderOptionsStepsProviderHook(
      [{ type: 'welcome' }, ...defaultSteps],
      true,
      defaultConsents
    )

    verifyUserConsentStepIndex(result.current?.steps, 1)
  })

  it('does not add "userConsent" step if Feature Flag is not enabled', async () => {
    const { result } = renderOptionsStepsProviderHook(
      defaultSteps,
      false,
      defaultConsents
    )

    verifyUserConsentStepIndex(result.current?.steps, -1)
  })

  it('skips "userConsent" step if consents already granted', async () => {
    const { result } = renderOptionsStepsProviderHook(defaultSteps, true, [
      {
        name: 'privacy_notices_read',
        granted: true,
        required: true,
      },
    ])

    expect(result.current?.steps[0].options?.skip).toBeTruthy()
  })

  it('skips "userConsent" step if consents not required', async () => {
    const { result } = renderOptionsStepsProviderHook(defaultSteps, true, [
      {
        name: 'privacy_notices_read',
        granted: true,
        required: false,
      },
    ])

    expect(result.current?.steps[0].options?.skip).toBeTruthy()
  })
})
