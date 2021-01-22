import type { ComponentType } from 'preact'
import Welcome from '../Welcome'
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
  DocumentVideoConfirm,
  SelfieConfirm,
  FaceVideoConfirm,
} from '../Confirm'
import Complete from '../Complete'
import MobileFlow from '../crossDevice/MobileFlow'
import CrossDeviceLink from '../crossDevice/CrossDeviceLink'
import ClientSuccess from '../crossDevice/ClientSuccess'
import CrossDeviceIntro from '../crossDevice/Intro'
import FaceVideoIntro from '../FaceVideo/Intro'
import { PoACapture, PoAIntro, PoAGuidance } from '../ProofOfAddress'
import { isDesktop, isHybrid, hasOnePreselectedDocument } from '~utils'
import { getCountryDataForDocumentType } from '../../supported-documents'

import type {
  ExtendedStepTypes,
  ExtendedStepConfig,
  FlowVariants,
} from '~types/commons'
import type { StepComponentProps, ComponentStep } from '~types/routers'
import type {
  DocumentTypes,
  PoaTypes,
  StepConfig,
  StepConfigDocument,
  StepConfigFace,
} from '~types/steps'

type ComponentsByStepType = Partial<
  Record<ExtendedStepTypes, ComponentType<StepComponentProps>[]>
>

const shallowFlatten = <T>(list: T[][]): T[] => [].concat(...list)

export const buildComponentsList = ({
  flow,
  documentType,
  steps,
  mobileFlow,
  deviceHasCameraSupport,
}: {
  flow: FlowVariants
  documentType: DocumentTypes
  poaDocumentType: PoaTypes
  steps: StepConfig[]
  mobileFlow: boolean
  deviceHasCameraSupport: boolean
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
  documentStep: Optional<StepConfigDocument>,
  deviceHasCameraSupport: boolean
): boolean => {
  const canUseLiveDocumentCapture =
    (!isDesktop || isHybrid) && documentStep?.options?.useLiveDocumentCapture

  return (
    (canUseLiveDocumentCapture || documentStep?.options?.useWebcam) &&
    deviceHasCameraSupport
  )
}

const buildCaptureStepComponents = (
  documentType: DocumentTypes,
  mobileFlow: boolean,
  steps: StepConfig[],
  deviceHasCameraSupport: boolean
): ComponentsByStepType => {
  const faceStep = steps.find((step) => step.type === 'face') as StepConfigFace

  const documentStep = steps.find(
    (step) => step.type === 'document'
  ) as StepConfigDocument

  const complete = mobileFlow ? [ClientSuccess] : [Complete]

  return {
    welcome: [Welcome],
    face: buildFaceComponents(faceStep, deviceHasCameraSupport, mobileFlow),
    document: buildDocumentComponents(
      documentStep,
      documentType,
      hasOnePreselectedDocument(steps),
      shouldUseCameraForDocumentCapture(documentStep, deviceHasCameraSupport)
    ),
    poa: [
      PoAIntro,
      SelectPoADocument,
      PoAGuidance,
      PoACapture,
      DocumentFrontConfirm,
    ],
    complete,
  }
}

const buildFaceComponents = (
  faceStep: Optional<StepConfigFace>,
  deviceHasCameraSupport: boolean,
  mobileFlow: boolean
): ComponentType<StepComponentProps>[] => {
  const shouldDisplayUploader = faceStep?.options?.useUploader

  // if shouldDisplayUploader is true webcam should not be used
  const shouldSelfieScreenUseCamera =
    !shouldDisplayUploader && deviceHasCameraSupport

  const shouldUseVideo =
    faceStep?.options?.requestedVariant === 'video' &&
    window.MediaRecorder != null

  return shouldUseVideo
    ? buildRequiredVideoComponents(deviceHasCameraSupport, mobileFlow)
    : buildRequiredSelfieComponents(shouldSelfieScreenUseCamera)
}

const buildRequiredVideoComponents = (
  shouldUseCamera: boolean,
  mobileFlow: boolean
): ComponentType<StepComponentProps>[] => {
  const allVideoSteps = [FaceVideoIntro, FaceVideoCapture, FaceVideoConfirm]

  if (mobileFlow && !shouldUseCamera) {
    // do not display intro on cross device flow
    return allVideoSteps.slice(1)
  }

  return allVideoSteps
}

const buildRequiredSelfieComponents = (
  deviceHasCameraSupport: boolean
): ComponentType<StepComponentProps>[] => {
  const allSelfieSteps = [SelfieIntro, SelfieCapture, SelfieConfirm]

  if (!deviceHasCameraSupport) {
    // do not display intro if camera cannot be used
    return allSelfieSteps.slice(1)
  }

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
  documentStep: Optional<StepConfigDocument>,
  documentType: Optional<DocumentTypes>,
  hasOnePreselectedDocument: boolean,
  shouldUseCamera: boolean
): ComponentType<StepComponentProps>[] => {
  // DEPRECATED: documentStep.options.showCountrySelection will be deprecated in a future release
  const showCountrySelectionForSinglePreselectedDocument =
    documentStep?.options?.showCountrySelection

  const configForDocumentType =
    documentStep?.options?.documentTypes[documentType]

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

  if (isPassportDocument) {
    const preCaptureComponents = hasOnePreselectedDocument
      ? []
      : [SelectIdentityDocument]

    if (shouldUseVideo) {
      return [...preCaptureComponents, ...videoCaptureComponents]
    }

    const standardCaptureComponents = shouldUseCamera
      ? [DocumentFrontCapture, DocumentFrontConfirm]
      : [DocumentFrontCapture, ImageQualityGuide, DocumentFrontConfirm]

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
    return [...preCaptureComponents, ...videoCaptureComponents]
  }

  const frontCaptureComponents = [
    ...preCaptureComponents,
    DocumentFrontCapture,
    DocumentFrontConfirm,
  ]

  if (doubleSidedDocs.includes(documentType)) {
    return [...frontCaptureComponents, DocumentBackCapture, DocumentBackConfirm]
  }

  return frontCaptureComponents
}

const crossDeviceSteps = (steps: StepConfig[]): ExtendedStepConfig[] => {
  const baseSteps: ExtendedStepConfig[] = [{ type: 'crossDevice' }]
  const completeStep = steps.find(isComplete)
  return hasCompleteStep(steps) ? [...baseSteps, completeStep] : baseSteps
}

const crossDeviceComponents: ComponentsByStepType = {
  crossDevice: [CrossDeviceIntro, CrossDeviceLink, MobileFlow],
  complete: [Complete],
}

const buildComponentsFromSteps = (
  components: ComponentsByStepType,
  steps: ExtendedStepConfig[]
): ComponentStep[] =>
  shallowFlatten(
    steps.map((step, stepIndex) => createComponent(components, step, stepIndex))
  )

const createComponent = (
  components: ComponentsByStepType,
  step: ExtendedStepConfig,
  stepIndex: number
): ComponentStep[] => {
  const { type } = step
  if (!(type in components)) {
    console.error(`No such step: ${type}`)
  }
  return components[type].map(wrapComponent(step, stepIndex))
}

const wrapComponent = (step: ExtendedStepConfig, stepIndex: number) => (
  component: ComponentType<StepComponentProps>
): ComponentStep => ({
  component,
  step,
  stepIndex,
})
