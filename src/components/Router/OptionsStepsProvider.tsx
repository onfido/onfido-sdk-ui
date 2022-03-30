import { Fragment, h } from 'preact'
import { StepConfig } from '~types/steps'
import { NarrowSdkOptions } from '~types/commons'
import useUserConsent from '~contexts/useUserConsent'

type OptionsStepsProps = {
  children: (steps: StepConfig[]) => React.ReactNode
  options: NarrowSdkOptions
}
export const OptionsStepsProvider = ({
  children,
  options: { steps },
}: OptionsStepsProps) => {
  const { enabled, consents } = useUserConsent()

  if (enabled && consents.some((c) => c.required && !c.granted)) {
    const userConsent: StepConfig = {
      type: 'userConsent',
      options: { excludeFromHistory: true },
    }
    const welcomeIndex = steps.findIndex(({ type }) => type === 'welcome')
    const userConsentIndex = welcomeIndex === -1 ? 0 : welcomeIndex + 1

    return (
      <Fragment>
        {children([
          ...steps.slice(0, userConsentIndex),
          userConsent,
          ...steps.slice(userConsentIndex),
        ])}
      </Fragment>
    )
  }

  return <Fragment>{children(steps)}</Fragment>
}
