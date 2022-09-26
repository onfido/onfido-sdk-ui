import { h, render } from 'preact'
import labels from 'react-phone-number-input/locale/en.json'
import 'custom-event-polyfill'

// Note: IE11 needs a couple of polyfills on top of being compiled to es5
import 'core-js/es/object/entries'
import 'core-js/es/object/from-entries'
import 'core-js/stable/url'
import 'core-js/stable/array'
import 'whatwg-fetch'

import { noop } from '~utils/func'
import { upperCase } from '~utils/string'
import { buildStepFinder } from '~utils/steps'
import { cssVarsPonyfill } from '~utils/cssVarsPonyfill'
import type {
  NormalisedSdkOptions,
  SDKOptionsWithRenderData,
} from '~types/commons'
import type { SdkOptions, SdkHandle } from '~types/sdk'
import type { StepConfig, StepTypes } from '~types/steps'
import App from './components/App'

if (process.env.NODE_ENV === 'development') {
  require('preact/debug')
}

const onfidoRender = (
  options: SDKOptionsWithRenderData,
  el: Element | Document | ShadowRoot | DocumentFragment,
  merge?: Element | Text
) => render(<App options={options} />, el, merge)

const defaults: SdkOptions = {
  token: undefined,
  containerId: 'onfido-mount',
  onComplete: noop,
  onError: noop,
  onUserExit: noop,
}

export const formatStep = (typeOrStep: StepConfig | StepTypes): StepConfig => {
  if (typeof typeOrStep === 'string') {
    return { type: typeOrStep }
  }

  return typeOrStep
}

const formatOptions = ({
  steps,
  smsNumberCountryCode,
  ...otherOptions
}: SdkOptions): NormalisedSdkOptions => {
  const useWorkflow = Boolean(otherOptions.workflowRunId)

  const mandatorySteps: StepTypes[] = useWorkflow
    ? []
    : ['document', 'face', 'complete']
  const internalSteps: StepTypes[] = ['userConsent']

  //@ts-ignorets TODO: quick fix, remove this whole block when the welcome screen is configured via workflow
  const welcomeStep =
    steps?.map(formatStep).find((i) => i.type === 'welcome') || 'welcome'

  const defaultSteps: (StepTypes | StepConfig)[] =
    process.env.SDK_ENV === 'Auth'
      ? [welcomeStep, 'auth', ...mandatorySteps]
      : [welcomeStep, ...mandatorySteps]

  return {
    ...otherOptions,
    smsNumberCountryCode: validateSmsCountryCode(smsNumberCountryCode),
    useWorkflow,
    steps: useWorkflow
      ? defaultSteps.map(formatStep)
      : (steps || defaultSteps)
          .map(formatStep)
          .filter(({ type }) => !internalSteps.includes(type)),
  }
}

const experimentalFeatureWarnings = ({ steps }: NormalisedSdkOptions) => {
  const documentStep = buildStepFinder(steps)('document')

  if (documentStep?.options?.useWebcam) {
    console.warn(
      '`useWebcam` is an experimental option and is currently discouraged'
    )
  }

  if (documentStep?.options?.useLiveDocumentCapture) {
    console.warn(
      '`useLiveDocumentCapture` is a beta feature and is still subject to ongoing changes'
    )
  }

  const activeVideoStep = buildStepFinder(steps)('activeVideo')

  if (activeVideoStep) {
    console.warn(
      '`activeVideo` is a beta feature and is still subject to ongoing changes'
    )
    import(/* webpackPrefetch: true */ './components/ActiveVideo/ActiveVideo')
  }
}

const isSMSCountryCodeValid = (smsNumberCountryCode: string) => {
  // If you need to refactor this code, remember not to introduce large libraries such as
  // libphonenumber-js in the main bundle!
  // HACK: Not using react-phone-number-input's getCountries() method as it requires a metadata object from libphonenumber-js
  const countries = Object.keys(labels)
  const isCodeValid = countries.includes(smsNumberCountryCode)
  if (!isCodeValid) {
    console.warn(
      "`smsNumberCountryCode` must be a valid two-characters ISO Country Code. 'GB' will be used instead."
    )
  }
  return isCodeValid
}

const validateSmsCountryCode = (
  smsNumberCountryCode?: string
): string | undefined => {
  if (!smsNumberCountryCode) return 'GB'
  const upperCaseCode = upperCase(smsNumberCountryCode)
  return isSMSCountryCodeValid(upperCaseCode) ? upperCaseCode : 'GB'
}

const elementIsInPage = (node: HTMLElement) =>
  node === document.body ? false : document.body.contains(node)

const getContainerElementById = (containerId: string) => {
  const el = document.getElementById(containerId)

  if (el && elementIsInPage(el)) {
    return el
  }

  throw new Error(
    `Element ID ${containerId} does not exist in current page body`
  )
}

export const init = (opts: SdkOptions): SdkHandle => {
  console.log(
    'onfido_sdk_version',
    process.env.SDK_VERSION,
    process.env.COMMITHASH
  )
  const options = formatOptions({ ...defaults, ...opts })

  experimentalFeatureWarnings(options)
  cssVarsPonyfill()

  let containerEl: HTMLElement

  if (options.containerEl) {
    containerEl = options.containerEl
    onfidoRender(options as SDKOptionsWithRenderData, containerEl)
  } else if (options.containerId) {
    containerEl = getContainerElementById(options.containerId)
    onfidoRender(options as SDKOptionsWithRenderData, containerEl)
  }

  return {
    options,
    setOptions(changedOptions) {
      opts = { ...opts, ...changedOptions }
      this.options = formatOptions({ ...opts, ...changedOptions })
      if (
        this.options.containerEl !== changedOptions.containerEl &&
        changedOptions.containerEl
      ) {
        containerEl = changedOptions.containerEl
      } else if (
        this.containerId !== changedOptions.containerId &&
        changedOptions.containerId
      ) {
        containerEl = getContainerElementById(changedOptions.containerId)
      }
      onfidoRender(this.options as SDKOptionsWithRenderData, containerEl)
      return this.options
    },
    tearDown() {
      render(null, containerEl)
    },
  }
}
