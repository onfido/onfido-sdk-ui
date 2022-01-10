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
import CrossDeviceClientIntro from 'components/crossDevice/ClientIntro'
import ClientSuccess from '../crossDevice/ClientSuccess'
import CrossDeviceIntro from '../crossDevice/Intro'
import FaceVideoIntro from '../FaceVideo/Intro'
import { PoACapture, PoAIntro, PoAGuidance } from '../ProofOfAddress'
import { isDesktop, isHybrid } from '~utils'
import { buildStepFinder, hasOnePreselectedDocument } from '~utils/steps'
import { getCountryDataForDocumentType } from '~supported-documents'

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

let LazyAuth: ComponentType<StepComponentProps>

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
  const captureSteps = mobileFlow ? buildCrossDeviceClientSteps(steps) : steps

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
    : buildComponentsFromSteps(
        crossDeviceDesktopComponents,
        crossDeviceIntroSessionSteps(steps)
      )
}

const isComplete = (step: StepConfig): boolean => step.type === 'complete'

const hasCompleteStep = (steps: StepConfig[]): boolean => steps.some(isComplete)

const buildCrossDeviceClientSteps = (steps: StepConfig[]): StepConfig[] =>
  hasCompleteStep(steps) ? steps : [...steps, { type: 'complete' }]

const shouldUseCameraForDocumentCapture = (
  documentStep?: StepConfigDocument,
  deviceHasCameraSupport?: boolean
): boolean => {
  const canUseLiveDocumentCapture =
    (!isDesktop || isHybrid) && documentStep?.options?.useLiveDocumentCapture

  const canUseMultiFrameCapture =
    (!isDesktop || isHybrid) && documentStep?.options?.useMultiFrameCapture

  return (
    (canUseLiveDocumentCapture ||
      canUseMultiFrameCapture ||
      documentStep?.options?.useWebcam === true) &&
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
  const captureStepTypes = new Set(['document', 'poa', 'face'])
  const firstCaptureStepType = steps.filter((step) =>
    captureStepTypes.has(step?.type)
  )[0]?.type
  const showCrossDeviceClientIntroForFaceStep =
    mobileFlow && firstCaptureStepType === 'face'

  return {
    welcome: [Welcome],
    userConsent: [UserConsent],
    face: [
      ...buildFaceComponents(
        faceStep,
        deviceHasCameraSupport,
        mobileFlow,
        showCrossDeviceClientIntroForFaceStep
      ),
    ],
    ...(SDK_ENV === 'Auth' && {
      auth: [LazyAuth],
    }),
    document: [
      ...buildDocumentComponents(
        documentStep,
        documentType,
        hasOnePreselectedDocument(steps),
        shouldUseCameraForDocumentCapture(documentStep, deviceHasCameraSupport),
        mobileFlow,
        firstCaptureStepType === 'document'
      ),
    ],
    poa: [...buildPoaComponents(mobileFlow, firstCaptureStepType === 'poa')],
    complete,
  }
}

const buildFaceComponents = (
  faceStep?: StepConfigFace,
  deviceHasCameraSupport?: boolean,
  mobileFlow?: boolean,
  isFirstCaptureStepInFlow?: boolean | undefined
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
        mobileFlow,
        isFirstCaptureStepInFlow
      )
    : buildRequiredSelfieComponents(
        shouldSelfieScreenUseCamera,
        mobileFlow,
        isFirstCaptureStepInFlow
      )
}

const buildRequiredVideoComponents = (
  shouldUseCamera?: boolean,
  mobileFlow?: boolean,
  isFirstCaptureStepInFlow?: boolean
): ComponentType<StepComponentProps>[] => {
  // @TODO: convert FaceVideoCapture, FaceVideoConfirm to TS
  const allVideoSteps = [FaceVideoIntro, FaceVideoCapture, FaceVideoConfirm]

  if (mobileFlow && !shouldUseCamera) {
    // do not display intro on cross device flow
    // @ts-ignore
    return allVideoSteps.slice(1)
  }

  // @ts-ignore
  return mobileFlow && isFirstCaptureStepInFlow
    ? // @ts-ignore
      buildCrossDeviceClientComponents(allVideoSteps)
    : allVideoSteps
}

const buildRequiredSelfieComponents = (
  deviceHasCameraSupport?: boolean,
  mobileFlow?: boolean,
  isFirstCaptureStepInFlow?: boolean
): ComponentType<StepComponentProps>[] => {
  // @TODO: convert SelfieIntro, SelfieCapture, SelfieConfirm to TS
  const allSelfieSteps = [SelfieIntro, SelfieCapture, SelfieConfirm]

  if (!deviceHasCameraSupport) {
    // do not display intro if camera cannot be used
    // @ts-ignore
    return allSelfieSteps.slice(1)
  }

  // @ts-ignore
  return mobileFlow && isFirstCaptureStepInFlow
    ? // @ts-ignore
      buildCrossDeviceClientComponents(allSelfieSteps)
    : allSelfieSteps
}

const buildNonPassportPreCaptureComponents = (
  hasOnePreselectedDocument: boolean,
  showCountrySelection: boolean
): ComponentType<StepComponentProps>[] => {
  const prependDocumentSelector = hasOnePreselectedDocument
    ? []
    : [SelectIdentityDocument]
  const prependCountrySelector = showCountrySelection ? [CountrySelector] : []
  // @ts-ignore
  // TODO: convert DocumentSelector to TS
  return [...prependDocumentSelector, ...prependCountrySelector]
}

const buildDocumentComponents = (
  documentStep: StepConfigDocument | undefined,
  documentType: DocumentTypes | undefined,
  hasOnePreselectedDocument: boolean,
  shouldUseCamera: boolean,
  mobileFlow: boolean | undefined,
  isFirstCaptureStepInFlow: boolean | undefined
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

  // @TODO: convert SelectIdentityDocument, DocumentFrontConfirm & ImageQualityGuide to TS
  if (isPassportDocument) {
    const preCaptureComponents = hasOnePreselectedDocument
      ? []
      : [SelectIdentityDocument]

    if (shouldUseVideo) {
      // @ts-ignore
      return mobileFlow && isFirstCaptureStepInFlow
        ? [
            // @ts-ignore
            ...buildCrossDeviceClientComponents(videoCaptureComponents),
          ]
        : [...preCaptureComponents, ...videoCaptureComponents]
    }

    const standardCaptureComponents = shouldUseCamera
      ? [DocumentFrontCapture, DocumentFrontConfirm]
      : [DocumentFrontCapture, ImageQualityGuide, DocumentFrontConfirm]

    // @ts-ignore
    return mobileFlow && isFirstCaptureStepInFlow
      ? [
          // @ts-ignore
          ...buildCrossDeviceClientComponents(standardCaptureComponents),
        ]
      : [...preCaptureComponents, ...standardCaptureComponents]
  }

  const countryCode =
    typeof configForDocumentType === 'boolean'
      ? null
      : configForDocumentType?.country
  const supportedCountry = getCountryDataForDocumentType(
    countryCode,
    documentType
  )
  const hasMultipleDocumentsWithUnsupportedCountry =
    !hasOnePreselectedDocument && !supportedCountry
  const hasCountryCodeOrDocumentTypeFlag =
    countryCode !== null || configForDocumentType === true
  const showCountrySelection =
    showCountrySelectionForSinglePreselectedDocument ||
    (hasMultipleDocumentsWithUnsupportedCountry &&
      hasCountryCodeOrDocumentTypeFlag)

  const preCaptureComponents = buildNonPassportPreCaptureComponents(
    hasOnePreselectedDocument,
    showCountrySelection
  )

  if (shouldUseVideo) {
    // @ts-ignore
    return mobileFlow && isFirstCaptureStepInFlow
      ? [
          // @ts-ignore
          ...buildCrossDeviceClientComponents(videoCaptureComponents),
          ...videoCaptureComponents,
        ]
      : [...preCaptureComponents, ...videoCaptureComponents]
  }

  // @TODO: convert DocumentFrontCapture, DocumentFrontConfirm to TS
  const frontCaptureComponents = [DocumentFrontCapture, DocumentFrontConfirm]
  const requiredFrontCaptureComponents =
    mobileFlow && isFirstCaptureStepInFlow
      ? [
          // @ts-ignore
          ...buildCrossDeviceClientComponents(frontCaptureComponents),
        ]
      : [...preCaptureComponents, ...frontCaptureComponents]

  if (documentType && doubleSidedDocs.includes(documentType)) {
    // @TODO: convert DocumentBackCapture, DocumentBackCapture to TS & remove all the @ts-ignore
    // @ts-ignore
    return [
      // @ts-ignore
      ...requiredFrontCaptureComponents,
      // @ts-ignore
      DocumentBackCapture,
      // @ts-ignore
      DocumentBackConfirm,
    ]
  }

  // @ts-ignore
  return requiredFrontCaptureComponents
}

const buildPoaComponents = (
  mobileFlow: boolean | undefined,
  isFirstCaptureStepInFlow: boolean | undefined
): ComponentType<StepComponentProps>[] => {
  // @TODO: convert PoAIntro, SelectPoADocument, PoAGuidance, PoACapture, DocumentFrontConfirm to TS & remove @ts-ignore
  const preCaptureComponents = [PoAIntro, SelectPoADocument, PoAGuidance]
  const captureComponents = [PoACapture, DocumentFrontConfirm]
  // @ts-ignore
  return mobileFlow && isFirstCaptureStepInFlow
    ? [
        // @ts-ignore
        ...buildCrossDeviceClientComponents(captureComponents),
      ]
    : [...preCaptureComponents, ...captureComponents]
}

const crossDeviceIntroSessionSteps = (
  steps: StepConfig[]
): ExtendedStepConfig[] => {
  const baseSteps: ExtendedStepConfig[] = [{ type: 'crossDevice' }]
  const completeStep = steps.find(isComplete) as ExtendedStepConfig
  return hasCompleteStep(steps) ? [...baseSteps, completeStep] : baseSteps
}

const crossDeviceDesktopComponents: ComponentsByStepType = {
  // @TODO: convert CrossDeviceIntro into TS
  // @ts-ignore
  crossDevice: [CrossDeviceIntro, CrossDeviceLink, MobileFlow],
  complete: [Complete],
}

const buildCrossDeviceClientComponents = (
  captureComponents: ComponentType<StepComponentProps>[]
): ComponentType<StepComponentProps>[] => {
  return [CrossDeviceClientIntro, ...captureComponents]
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
