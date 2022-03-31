import '@testing-library/jest-dom'
import { h } from 'preact'

import type { NarrowSdkOptions } from '~types/commons'
import { render } from '@testing-library/preact'
import { OptionsStepsProvider } from '../OptionsStepsProvider'
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
    <OptionsStepsProvider options={options}>
      {(steps) => {
        providedSteps = steps
        return undefined
      }}
    </OptionsStepsProvider>
  </UserConsentContext.Provider>
)

const defaultOptions: NarrowSdkOptions = {
  steps: [{ type: 'welcome' }],
}

const defaultUserConsentContextValue = {
  enabled: true,
  consents: [
    {
      name: 'privacy_notices_read_consent_given',
      granted: false,
      required: true,
    },
  ],
  grantConsents: () => Promise.resolve(),
}

describe('OptionsStepsProvider', () => {
  it('adds "userConsent" step if consents are not already granted', async () => {
    render(
      <Wrapper
        userConsentContextValue={defaultUserConsentContextValue}
        options={defaultOptions}
      />
    )
    verifyUserConsentStepIndex(1)
  })

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

  it('does not add "userConsent" step if there is no consent to grand', async () => {
    render(
      <Wrapper
        userConsentContextValue={{
          ...defaultUserConsentContextValue,
          consents: [],
        }}
        options={{ ...defaultOptions }}
      />
    )
    verifyUserConsentStepIndex(-1)
  })

  it('does not add "userConsent" step if all consents are already granted', async () => {
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
          ],
        }}
        options={defaultOptions}
      />
    )
    verifyUserConsentStepIndex(-1)
  })
})
