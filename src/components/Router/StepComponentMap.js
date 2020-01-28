import { h } from 'preact'
import Welcome from '../Welcome'
import { SelectPoADocument, SelectIdentityDocument } from '../Select'
import { FrontDocumentCapture, BackDocumentCapture, SelfieCapture, VideoCapture } from '../Capture'
import SelfieIntro from '../Photo/SelfieIntro'
import { DocumentFrontConfirm, DocumentBackConfirm, SelfieConfirm, VideoConfirm } from '../Confirm'
import Complete from '../Complete'
import MobileFlow from '../crossDevice/MobileFlow'
import CrossDeviceLink from '../crossDevice/CrossDeviceLink'
import ClientSuccess from '../crossDevice/ClientSuccess'
import CrossDeviceIntro from '../crossDevice/Intro'
import VideoIntro from '../Video/Intro'
import { PoACapture, PoAIntro, PoAGuidance } from '../ProofOfAddress'

export const componentsList = ({flow, documentType, steps, mobileFlow, deviceHasCameraSupport}) => {
  const captureSteps = mobileFlow ? clientCaptureSteps(steps) : steps
  return flow === 'captureSteps' ?
    createComponentList(captureStepsComponents(documentType, mobileFlow, steps, deviceHasCameraSupport), captureSteps) :
    createComponentList(crossDeviceComponents, crossDeviceSteps(steps))
}

const isComplete = (step) => step.type === 'complete'

const hasCompleteStep = (steps) => steps.some(isComplete)

const clientCaptureSteps = (steps) =>
  hasCompleteStep(steps) ? steps : [...steps, {type: 'complete'}]

const shouldUseVideo = steps => {
  const { options: faceOptions } = steps.find(({ type }) => type === 'face') || {}
  return (faceOptions || {}).requestedVariant === 'video' && window.MediaRecorder
}

const hasPreselectedDocument = (steps) => enabledDocuments(steps).length === 1

// This logic should not live here.
// It should be exported into a helper when the documentType logic and routing is refactored
export const enabledDocuments = (steps) => {
  const documentStep = steps.find(step => step.type === 'document')
  const docTypes = documentStep && documentStep.options && documentStep.options.documentTypes
  return docTypes ? Object.keys(docTypes).filter((type) => docTypes[type]) : []
}

const captureStepsComponents = (documentType, mobileFlow, steps, deviceHasCameraSupport) => {
  const complete = mobileFlow ? [ClientSuccess] : [Complete]
  return {
    welcome: () => [Welcome],
    face: () => getFaceSteps(steps, deviceHasCameraSupport, mobileFlow),
    document: () => createIdentityDocumentComponents(documentType, hasPreselectedDocument(steps)),
    poa: () => [PoAIntro, SelectPoADocument, PoAGuidance, PoACapture, DocumentFrontConfirm],
    complete: () => complete
  }
}

const getFaceSteps = (steps, deviceHasCameraSupport, mobileFlow) => {
  const faceStep = steps.filter(step => step.type === "face")[0]
  const shouldDisplayUploader = faceStep.options && faceStep.options.useUploader
  // if shouldDisplayUploader is true webcam should not be used
  const shouldSelfieScreenUseCamera = !shouldDisplayUploader && deviceHasCameraSupport
  return shouldUseVideo(steps) ?
      getRequiredVideoSteps(deviceHasCameraSupport, mobileFlow) :
      getRequiredSelfieSteps(shouldSelfieScreenUseCamera)
}

const getRequiredVideoSteps = (shouldUseCamera, mobileFlow) => {
  const allVideoSteps = [VideoIntro, VideoCapture, VideoConfirm]
  if (mobileFlow && !shouldUseCamera) {
    // do not display intro on cross device flow
    return allVideoSteps.slice(1)
  }
  return allVideoSteps
}

const getRequiredSelfieSteps = (deviceHasCameraSupport) => {
  const allSelfieSteps = [SelfieIntro, SelfieCapture, SelfieConfirm]
  if (!deviceHasCameraSupport) {
    // do not display intro if camera cannot be used
    return allSelfieSteps.slice(1)
  }
  return allSelfieSteps
}

const createIdentityDocumentComponents = (documentType, hasPreselectedDocument) => {
  const double_sided_docs = ['driving_licence', 'national_identity_card']
  const frontCaptureComponents = [FrontDocumentCapture, DocumentFrontConfirm]
  const withSelectScreen = [SelectIdentityDocument, ...frontCaptureComponents]
  const frontDocumentFlow = hasPreselectedDocument ? frontCaptureComponents : withSelectScreen
  if (double_sided_docs.includes(documentType)) {
    return [...frontDocumentFlow, BackDocumentCapture, DocumentBackConfirm]
  }
  return frontDocumentFlow
}

const crossDeviceSteps = (steps) => {
  const baseSteps = [{'type': 'crossDevice'}]
  const completeStep = steps.find(isComplete)
  return hasCompleteStep(steps) ? [...baseSteps, completeStep] : baseSteps
}

const crossDeviceComponents = {
  crossDevice: () => [CrossDeviceIntro, CrossDeviceLink, MobileFlow],
  complete: () => [Complete]
}

const createComponentList = (components, steps) => {
  const mapSteps = (step, stepIndex) => createComponent(components, step, stepIndex)
  return shallowFlatten(steps.map(mapSteps))
}

const createComponent = (components, step, stepIndex) => {
  const {type} = step
  if (!(type in components)) { console.error('No such step: ' + type) }
  return components[type]().map(wrapComponent(step, stepIndex))
}

const wrapComponent = (step, stepIndex) => (component) => ({component, step, stepIndex})

const shallowFlatten = list => [].concat(...list)
