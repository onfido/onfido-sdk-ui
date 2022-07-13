import { h, ComponentType } from 'preact'
import Welcome from '../Welcome'
import UserConsent from '../UserConsent'

import ImageQualityGuide from '../Uploader/ImageQualityGuide'
import SelfieIntro from '../Photo/SelfieIntro'
import {
  DocumentBackCapture,
  DocumentFrontCapture,
  DocumentVideoCapture,
  DataCapture,
  FaceVideoCapture,
  PoACapture,
  SelfieCapture,
} from '../Capture'
import {
  DocumentBackConfirm,
  DocumentFrontConfirm,
  FaceVideoConfirm,
  PoAConfirm,
  SelfieConfirm,
} from '../Confirm'
import DocumentVideoConfirm from '../DocumentVideo/Confirm'
import Complete from '../Complete'
import Retry from '../WorkflowEngine/Retry'
import MobileFlow from '../crossDevice/MobileFlow'
import CrossDeviceLink from '../crossDevice/CrossDeviceLink'
import CrossDeviceClientIntro from 'components/crossDevice/ClientIntro'
import ClientSuccess from '../crossDevice/ClientSuccess'
import CrossDeviceIntro from '../crossDevice/Intro'
import FaceVideoIntro from '../FaceVideo/Intro'
import LazyActiveVideo from '../ActiveVideo/Lazy'
import { isDesktop, isHybrid } from '~utils'
import { buildStepFinder, hasOnePreselectedDocument } from '~utils/steps'

import type {
  CountryData,
  ExtendedStepConfig,
  ExtendedStepTypes,
  FlowVariants,
} from '~types/commons'
import type { StepComponentProps, ComponentStep } from '~types/routers'
import type {
  DocumentTypes,
  StepConfig,
  StepConfigDocument,
  StepConfigFace,
  StepConfigData,
} from '~types/steps'
import PoAClientIntro from '../ProofOfAddress/PoAIntro'
import Guidance from '../ProofOfAddress/Guidance'
import PoADocumentSelector from '../DocumentSelector/PoADocumentSelector'
import PoACountrySelector from '../CountrySelector/PoACountrySelector'
import { RestrictedDocumentSelection } from '../RestrictedDocumentSelection'
import { getCountryDataForDocumentType } from '~supported-documents'

let LazyAuth: ComponentType<StepComponentProps>

const SDK_ENV = process.env.SDK_ENV

if (process.env.SDK_ENV === 'Auth') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  LazyAuth = require('../Auth/Lazy').default
}

type ComponentsByStepType = Partial<
  Record<ExtendedStepTypes, ComponentType<StepComponentProps>[]>
>

export type ComponentsListProps = {
  flow: FlowVariants
  documentType: DocumentTypes | undefined
  poaDocumentCountry?: CountryData | undefined
  steps: StepConfig[]
  mobileFlow?: boolean
  deviceHasCameraSupport?: boolean
  hasPreviousStep?: boolean
}

export const buildComponentsList = ({
  flow,
  documentType,
  steps,
  mobileFlow,
  deviceHasCameraSupport,
  poaDocumentCountry,
  hasPreviousStep,
}: ComponentsListProps): ComponentStep[] => {
  return flow === 'captureSteps'
    ? buildComponentsFromSteps(
        buildCaptureStepComponents(
          poaDocumentCountry,
          documentType,
          mobileFlow,
          steps,
          deviceHasCameraSupport,
          hasPreviousStep
        ),
        steps
      )
    : buildComponentsFromSteps(
        crossDeviceDesktopComponents,
        crossDeviceSteps(steps)
      )
}

const isComplete = (step: StepConfig): boolean => step.type === 'complete'

const hasCompleteStep = (steps: StepConfig[]): boolean => steps.some(isComplete)

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
  poaDocumentCountry: CountryData | undefined,
  documentType: DocumentTypes | undefined,
  mobileFlow: boolean | undefined,
  steps: StepConfig[],
  deviceHasCameraSupport?: boolean,
  hasPreviousStep?: boolean
): ComponentsByStepType => {
  const findStep = buildStepFinder(steps)
  const faceStep = findStep('face')
  const documentStep = findStep('document')
  const dataStep = findStep('data')
  const activeVideoStep = findStep('activeVideo')

  const complete = mobileFlow
    ? [ClientSuccess as ComponentType<StepComponentProps>]
    : [Complete]
  const captureStepTypes = new Set(['document', 'poa', 'face', 'data'])
  const firstCaptureStepType = steps.filter((step) =>
    captureStepTypes.has(step?.type)
  )[0]?.type

  return {
    welcome: [Welcome],
    userConsent: [UserConsent],
    face: [
      ...buildFaceComponents(
        faceStep,
        deviceHasCameraSupport,
        mobileFlow,
        !hasPreviousStep && mobileFlow && firstCaptureStepType === 'face'
      ),
    ],
    ...(SDK_ENV === 'Auth' && {
      auth: [LazyAuth],
    }),
    ...(activeVideoStep && {
      activeVideo: [LazyActiveVideo],
    }),
    document: [
      ...buildDocumentComponents(
        documentStep,
        documentType,
        hasOnePreselectedDocument(steps),
        shouldUseCameraForDocumentCapture(documentStep, deviceHasCameraSupport),
        mobileFlow,
        !hasPreviousStep && firstCaptureStepType === 'document'
      ),
    ],
    data: [...buildDataComponents(dataStep)],
    poa: [
      ...buildPoaComponents(
        poaDocumentCountry,
        mobileFlow,
        !hasPreviousStep && firstCaptureStepType === 'poa'
      ),
    ],
    complete,
    pass: [Complete],
    reject: [Complete],
    retry: [Retry],
  }
}

const buildDataComponents = (
  dataStep?: StepConfigData
): ComponentType<StepComponentProps>[] => {
  const CountryOfResidence = (props: any) => (
    <DataCapture
      {...props}
      title="country_of_residence_title"
      dataSubPath="address"
      dataFields={['country']}
      getPersonalData={dataStep?.options?.getPersonalData}
    />
  )
  const PersonalInformation = (props: any) => (
    <DataCapture
      {...props}
      title="personal_information_title"
      dataFields={['first_name', 'last_name', 'dob', 'ssn']}
      ssnEnabled={dataStep?.options?.ssn_enabled}
      getPersonalData={dataStep?.options?.getPersonalData}
    />
  )
  const Address = (props: any) => (
    <DataCapture
      {...props}
      title="address_title"
      dataSubPath="address"
      dataFields={[
        'country',
        'line1',
        'line2',
        'line3',
        'town',
        'state',
        'postcode',
      ]}
      disabledFields={['country']}
      getPersonalData={dataStep?.options?.getPersonalData}
    />
  )

  return [CountryOfResidence, PersonalInformation, Address]
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
  const prependDocumentSelector =
    hasOnePreselectedDocument && !showCountrySelection
      ? []
      : [RestrictedDocumentSelection]
  // @ts-ignore
  return [...prependDocumentSelector]
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
      : [RestrictedDocumentSelection]

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
    hasMultipleDocumentsWithUnsupportedCountry &&
    hasCountryCodeOrDocumentTypeFlag

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
  poaDocumentCountry: CountryData | undefined,
  mobileFlow: boolean | undefined,
  isFirstCaptureStepInFlow: boolean | undefined
): ComponentType<StepComponentProps>[] => {
  const preCaptureComponents = [
    PoAClientIntro,
    PoACountrySelector,
    PoADocumentSelector,
    Guidance as ComponentType<StepComponentProps>,
  ]
  const captureComponents = [
    PoACapture as ComponentType<StepComponentProps>,
    PoAConfirm,
  ]

  // @ts-ignore
  return mobileFlow && isFirstCaptureStepInFlow
    ? // @ts-ignore
      [...buildCrossDeviceClientComponents(captureComponents)]
    : [...preCaptureComponents, ...captureComponents]
}

const crossDeviceSteps = (steps: StepConfig[]): ExtendedStepConfig[] => {
  const baseSteps: ExtendedStepConfig[] = [{ type: 'crossDevice' }]
  const completeStep = steps.find(isComplete) as ExtendedStepConfig
  return hasCompleteStep(steps) ? [...baseSteps, completeStep] : baseSteps
}

const crossDeviceDesktopComponents: ComponentsByStepType = {
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
