import '@testing-library/jest-dom'
import { h } from 'preact'

import type { NarrowSdkOptions } from '~types/commons'
import { render } from '@testing-library/preact'
import { OptionsSteps } from '../OptionsSteps'
import { StepConfig } from '~types/steps'
import {
  ConsentContextValue,
  UserConsentContext,
} from '~contexts/useUserConsent'

let providedSteps: StepConfig[] = []

const verifyUserConsentStepIndex = (index: number) =>
  expect(providedSteps.findIndex(({ type }) => type === 'userConsent')).toEqual(
    index
  )

const Wrapper = ({
  userConsentContextValue,
  options,
}: {
  userConsentContextValue: ConsentContextValue
  options: NarrowSdkOptions
}) => (
  <UserConsentContext.Provider value={userConsentContextValue}>
    <OptionsSteps options={options}>
      {(steps) => {
        providedSteps = steps
        return undefined
      }}
    </OptionsSteps>
  </UserConsentContext.Provider>
)

const defaultOptions: NarrowSdkOptions = {
  steps: [{ type: 'welcome' }],
}

const defaultUserConsentContextValue: ConsentContextValue = {
  enabled: true,
  consents: [
    {
      name: 'privacy_notices_read_consent_given',
      granted: false,
      required: true,
    },
  ],
  updateConsents: () => Promise.resolve(),
}

describe('OptionsSteps', () => {
  it('adds "userConsent" after "welcome" step', async () => {
    render(
      <Wrapper
        userConsentContextValue={defaultUserConsentContextValue}
        options={{
          ...defaultOptions,
          steps: [{ type: 'document' }, { type: 'welcome' }],
        }}
      />
    )
    verifyUserConsentStepIndex(2)
  })

  it('adds "userConsent" and does not skips step if required consents not granted', async () => {
    render(
      <Wrapper
        userConsentContextValue={{
          ...defaultUserConsentContextValue,
          consents: [
            {
              name: 'privacy_notices_read_consent_given',
              granted: false,
              required: true,
            },
            {
              name: 'other_consent',
              granted: false,
              required: false,
            },
            {
              name: 'other_consent',
              granted: true,
              required: false,
            },
          ],
        }}
        options={{ ...defaultOptions }}
      />
    )

    verifyUserConsentStepIndex(1)
    expect(providedSteps[1].skip).toBeFalsy()
  })

  it('adds "userConsent" and skips step if required consents already granted', async () => {
    render(
      <Wrapper
        userConsentContextValue={{
          ...defaultUserConsentContextValue,
          consents: [
            {
              name: 'privacy_notices_read_consent_given',
              granted: true,
              required: true,
            },
            {
              name: 'other_consent',
              granted: false,
              required: false,
            },
            {
              name: 'other_consent',
              granted: true,
              required: false,
            },
          ],
        }}
        options={{ ...defaultOptions }}
      />
    )

    verifyUserConsentStepIndex(1)
    expect(providedSteps[1].skip).toBeTruthy()
  })

  it('does not add "userConsent" step if Feature Flag is not enabled', async () => {
    render(
      <Wrapper
        userConsentContextValue={{
          ...defaultUserConsentContextValue,
          enabled: false,
        }}
        options={{ ...defaultOptions }}
      />
    )
    verifyUserConsentStepIndex(-1)
  })

  it('does not add "userConsent" step if consents not required', async () => {
    render(
      <Wrapper
        userConsentContextValue={{
          ...defaultUserConsentContextValue,
          consents: [
            {
              name: 'privacy_notices_read',
              granted: true,
              required: false,
            },
            {
              name: 'other_consent',
              granted: false,
              required: false,
            },
          ],
        }}
        options={{ ...defaultOptions }}
      />
    )

    verifyUserConsentStepIndex(-1)
  })
})
