import type { ComponentType } from 'preact'
import Welcome from '../Welcome'
import UserConsent from '../UserConsent'
import { SelectPoADocument, SelectIdentityDocument } from '../Select'
import CountrySelector from '../CountrySelector'
import ImageQualityGuide from '../Uploader/ImageQualityGuide'
import SelfieIntro from '../Photo/SelfieIntro'
import {
  DocumentFrontCapture,
  DocumentBackCapture,
  DocumentVideoCapture,
  SelfieCapture,
  FaceVideoCapture,
} from '../Capture'
import {
  DocumentFrontConfirm,
  DocumentBackConfirm,
  SelfieConfirm,
  FaceVideoConfirm,
} from '../Confirm'
import DocumentVideoConfirm from '../DocumentVideo/Confirm'
import Complete from '../Complete'
import MobileFlow from '../crossDevice/MobileFlow'
import CrossDeviceLink from '../crossDevice/CrossDeviceLink'
import ClientSuccess from '../crossDevice/ClientSuccess'
import CrossDeviceIntro from '../crossDevice/Intro'
import FaceVideoIntro from '../FaceVideo/Intro'
import { PoACapture, PoAIntro, PoAGuidance } from '../ProofOfAddress'
import { isDesktop, isHybrid } from '~utils'
import { buildStepFinder, hasOnePreselectedDocument } from '~utils/steps'
import { getCountryDataForDocumentType } from '../../supported-documents'

let LazyAuth: ComponentType<ComponentType<Element>>

const SDK_ENV = process.env.SDK_ENV

if (process.env.SDK_ENV === 'Auth') {
  try {
    import('../Auth/Lazy')
      .then((lazy) => (LazyAuth = lazy.default))
      .catch(() => null)
  } catch (e) {
    console.log('there was an error')
  }
}

import type {
  ExtendedStepTypes,
  ExtendedStepConfig,
  FlowVariants,
} from '~types/commons'
import type { StepComponentProps, ComponentStep } from '~types/routers'
import type {
  DocumentTypes,
  StepConfig,
  StepConfigDocument,
  StepConfigFace,
} from '~types/steps'

type ComponentsByStepType = Partial<
  Record<ExtendedStepTypes, ComponentType<StepComponentProps>[]>
>

export const buildComponentsList = ({
  flow,
  documentType,
  steps,
  mobileFlow,
  deviceHasCameraSupport,
}: {
  flow: FlowVariants
  documentType: DocumentTypes | undefined
  steps: StepConfig[]
  mobileFlow?: boolean
  deviceHasCameraSupport?: boolean
}): ComponentStep[] => {
  const captureSteps = mobileFlow ? buildClientCaptureSteps(steps) : steps

  return flow === 'captureSteps'
    ? buildComponentsFromSteps(
        buildCaptureStepComponents(
          documentType,
          mobileFlow,
          steps,
          deviceHasCameraSupport
        ),
        captureSteps
      )
    : buildComponentsFromSteps(crossDeviceComponents, crossDeviceSteps(steps))
}

const isComplete = (step: StepConfig): boolean => step.type === 'complete'

const hasCompleteStep = (steps: StepConfig[]): boolean => steps.some(isComplete)

const buildClientCaptureSteps = (steps: StepConfig[]): StepConfig[] =>
  hasCompleteStep(steps) ? steps : [...steps, { type: 'complete' }]

const shouldUseCameraForDocumentCapture = (
  documentStep?: StepConfigDocument,
  deviceHasCameraSupport?: boolean
): boolean => {
  const canUseLiveDocumentCapture =
    (!isDesktop || isHybrid) && documentStep?.options?.useLiveDocumentCapture

  return (
    (canUseLiveDocumentCapture || documentStep?.options?.useWebcam === true) &&
    deviceHasCameraSupport === true
  )
}

const buildCaptureStepComponents = (
  documentType: DocumentTypes | undefined,
  mobileFlow: boolean | undefined,
  steps: StepConfig[],
  deviceHasCameraSupport?: boolean
): ComponentsByStepType => {
  const findStep = buildStepFinder(steps)
  const faceStep = findStep('face')
  const documentStep = findStep('document')

  const complete = mobileFlow ? [ClientSuccess] : [Complete]

  return {
    welcome: [Welcome],
    userConsent: [UserConsent],
    face: buildFaceComponents(faceStep, deviceHasCameraSupport, mobileFlow),
    ...(SDK_ENV === 'Auth' && {
      auth: [LazyAuth],
    }),
    document: buildDocumentComponents(
      documentStep,
      documentType,
      hasOnePreselectedDocument(steps),
      shouldUseCameraForDocumentCapture(documentStep, deviceHasCameraSupport)
    ),
    // @TODO: convert PoAIntro, SelectPoADocument, PoAGuidance, PoACapture, DocumentFrontConfirm to TS
    poa: [
      // @ts-ignore
      PoAIntro,
      SelectPoADocument,
      // @ts-ignore
      PoAGuidance,
      // @ts-ignore
      PoACapture,
      DocumentFrontConfirm,
    ],
    complete,
  }
}

const buildFaceComponents = (
  faceStep?: StepConfigFace,
  deviceHasCameraSupport?: boolean,
  mobileFlow?: boolean
): ComponentType<StepComponentProps>[] => {
  const shouldDisplayUploader = faceStep?.options?.useUploader

  // if shouldDisplayUploader is true webcam should not be used
  const shouldSelfieScreenUseCamera =
    !shouldDisplayUploader && deviceHasCameraSupport

  const videoCameraSupport = window.MediaRecorder != null

  const photoCaptureFallback = faceStep?.options?.photoCaptureFallback !== false

  const shouldUseVideo =
    faceStep?.options?.requestedVariant === 'video' &&
    (videoCameraSupport || !photoCaptureFallback)

  return shouldUseVideo
    ? buildRequiredVideoComponents(
        deviceHasCameraSupport && videoCameraSupport,
        mobileFlow
      )
    : buildRequiredSelfieComponents(shouldSelfieScreenUseCamera)
}

const buildRequiredVideoComponents = (
  shouldUseCamera?: boolean,
  mobileFlow?: boolean
): ComponentType<StepComponentProps>[] => {
  // @TODO: convert FaceVideoIntro, FaceVideoCapture, FaceVideoConfirm to TS
  const allVideoSteps = [FaceVideoIntro, FaceVideoCapture, FaceVideoConfirm]

  if (mobileFlow && !shouldUseCamera) {
    // do not display intro on cross device flow
    // @ts-ignore
    return allVideoSteps.slice(1)
  }

  // @ts-ignore
  return allVideoSteps
}

const buildRequiredSelfieComponents = (
  deviceHasCameraSupport?: boolean
): ComponentType<StepComponentProps>[] => {
  // @TODO: convert SelfieIntro, SelfieCapture, SelfieConfirm to TS
  const allSelfieSteps = [SelfieIntro, SelfieCapture, SelfieConfirm]

  if (!deviceHasCameraSupport) {
    // do not display intro if camera cannot be used
    // @ts-ignore
    return allSelfieSteps.slice(1)
  }

  // @ts-ignore
  return allSelfieSteps
}

const buildNonPassportPreCaptureComponents = (
  hasOnePreselectedDocument: boolean,
  showCountrySelection: boolean
): ComponentType<StepComponentProps>[] => {
  const prependDocumentSelector = hasOnePreselectedDocument
    ? []
    : [SelectIdentityDocument]
  const prependCountrySelector = showCountrySelection ? [CountrySelector] : []

  return [...prependDocumentSelector, ...prependCountrySelector]
}

const buildDocumentComponents = (
  documentStep: StepConfigDocument | undefined,
  documentType: DocumentTypes | undefined,
  hasOnePreselectedDocument: boolean,
  shouldUseCamera: boolean
): ComponentType<StepComponentProps>[] => {
  const options = documentStep?.options

  // DEPRECATED: documentStep.options.showCountrySelection will be deprecated in a future release
  const showCountrySelectionForSinglePreselectedDocument =
    options?.showCountrySelection

  const configForDocumentType =
    documentType && options?.documentTypes
      ? options?.documentTypes[documentType]
      : undefined

  const shouldUseVideo =
    documentStep?.options?.requestedVariant === 'video' &&
    window.MediaRecorder != null

  const videoCaptureComponents = [DocumentVideoCapture, DocumentVideoConfirm]

  const doubleSidedDocs: DocumentTypes[] = [
    'driving_licence',
    'national_identity_card',
    'residence_permit',
  ]
  const isPassportDocument = documentType === 'passport'

  // @TODO: convert SelectIdentityDocument, DocumentFrontCapture, DocumentFrontConfirm & ImageQualityGuide to TS
  if (isPassportDocument) {
    const preCaptureComponents = hasOnePreselectedDocument
      ? []
      : [SelectIdentityDocument]

    if (shouldUseVideo) {
      // @ts-ignore
      return [...preCaptureComponents, ...videoCaptureComponents]
    }

    /**
     * ImageQualityGuide is only shown when the flow is:
     *  - On desktop
     *  - Without `useWebcam` or `useLiveDocumentCapture` flag enabled
     *
     * Otherwise, one of the capture component is used:
     *  - DocumentMultiFrame (default)
     *  - DocumentAutoCapture (with `useWebcam`)
     *  - DocumentLiveCapture (with `useLiveDocumentCapture`)
     */
    const standardCaptureComponents =
      shouldUseCamera || !isDesktop
        ? [DocumentFrontCapture, DocumentFrontConfirm]
        : [DocumentFrontCapture, ImageQualityGuide, DocumentFrontConfirm]

    // @ts-ignore
    return [...preCaptureComponents, ...standardCaptureComponents]
  }

  const countryCode =
    typeof configForDocumentType === 'boolean'
      ? null
      : configForDocumentType?.country
  const supportedCountry = getCountryDataForDocumentType(
    countryCode,
    documentType
  )
  const showCountrySelection =
    showCountrySelectionForSinglePreselectedDocument ||
    (!hasOnePreselectedDocument && !supportedCountry && countryCode !== null)

  const preCaptureComponents = buildNonPassportPreCaptureComponents(
    hasOnePreselectedDocument,
    showCountrySelection
  )

  if (shouldUseVideo) {
    // @ts-ignore
    return [...preCaptureComponents, ...videoCaptureComponents]
  }

  const frontCaptureComponents = [
    ...preCaptureComponents,
    DocumentFrontCapture,
    DocumentFrontConfirm,
  ]

  if (documentType && doubleSidedDocs.includes(documentType)) {
    // @ts-ignore
    return [...frontCaptureComponents, DocumentBackCapture, DocumentBackConfirm]
  }

  // @ts-ignore
  return frontCaptureComponents
}

const crossDeviceSteps = (steps: StepConfig[]): ExtendedStepConfig[] => {
  const baseSteps: ExtendedStepConfig[] = [{ type: 'crossDevice' }]
  const completeStep = steps.find(isComplete) as ExtendedStepConfig
  return hasCompleteStep(steps) ? [...baseSteps, completeStep] : baseSteps
}

const crossDeviceComponents: ComponentsByStepType = {
  // @TODO: convert CrossDeviceIntro into TS
  // @ts-ignore
  crossDevice: [CrossDeviceIntro, CrossDeviceLink, MobileFlow],
  complete: [Complete],
}

const buildComponentsFromSteps = (
  components: ComponentsByStepType,
  steps: ExtendedStepConfig[]
): ComponentStep[] => {
  const builtSteps = steps.map((step, stepIndex) =>
    createComponent(components, step, stepIndex)
  )
  return ([] as ComponentStep[]).concat(...builtSteps)
}

const createComponent = (
  components: ComponentsByStepType,
  step: ExtendedStepConfig,
  stepIndex: number
): ComponentStep[] => {
  const { type } = step
  const componentsByStep = components[type]

  if (!componentsByStep) {
    console.error(`No such step: ${type}`)
    return []
  }

  return componentsByStep.map(wrapComponent(step, stepIndex))
}

const wrapComponent = (step: ExtendedStepConfig, stepIndex: number) => (
  component: ComponentType<StepComponentProps>
): ComponentStep => ({
  component,
  step,
  stepIndex,
})
