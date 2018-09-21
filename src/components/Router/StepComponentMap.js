import { h } from 'preact'

import Welcome from '../Welcome'
import {SelectPoADocument, SelectIdentityDocument} from '../Select'
import {FrontDocumentCapture, BackDocumentCapture, SelfieCapture, VideoCapture, PoADocumentCapture } from '../Capture'
import {DocumentFrontConfirm, DocumentBackConfirm, SelfieConfirm, VideoConfirm} from '../Confirm'
import Complete from '../Complete'
import MobileFlow from '../crossDevice/MobileFlow'
import CrossDeviceLink from '../crossDevice/CrossDeviceLink'
import ClientSuccess from '../crossDevice/ClientSuccess'
import CrossDeviceIntro from '../crossDevice/Intro'
import VideoIntro from '../Video/Intro'
import { PoACapture, PoAIntro, PoAGuidance } from '../ProofOfAddress'

export const componentsList = ({flow, documentType, steps, mobileFlow}) => {
  const captureSteps = mobileFlow ? clientCaptureSteps(steps) : steps
  return flow === 'captureSteps' ?
    createComponentList(captureStepsComponents(documentType, mobileFlow, steps), captureSteps) :
    createComponentList(crossDeviceComponents, crossDeviceSteps(steps))
}

const isComplete = (step) => step.type === 'complete'

const hasCompleteStep = (steps) => steps.some(isComplete)

const clientCaptureSteps = (steps) =>
  hasCompleteStep(steps) ? steps : [...steps, {type: 'complete'}]

const shouldUseVideo = steps => {
  const { options: faceOptions } = Array.find(steps, ({ type }) => type === 'face') || {}
  return (faceOptions || {}).requestedVariant === 'video' && window.MediaRecorder
}

const captureStepsComponents = (documentType, mobileFlow, steps) => {
  const complete = mobileFlow ? [ClientSuccess] : [Complete]

  return {
    welcome: () => [Welcome],
    face: () => shouldUseVideo(steps) ?
        [VideoIntro, VideoCapture, VideoConfirm] :
        [SelfieCapture, SelfieConfirm],
    document: () => createIdentityDocumentComponents(documentType),
    poa: () => [PoAIntro, SelectPoADocument, PoAGuidance, PoACapture, DocumentFrontConfirm],
    complete: () => complete
  }
}

const createIdentityDocumentComponents = (documentType) => {
  const double_sided_docs = ['driving_licence', 'national_identity_card']
  const frontDocumentFlow = [SelectIdentityDocument, FrontDocumentCapture, DocumentFrontConfirm]
  if (Array.includes(double_sided_docs, documentType)) {
    return [...frontDocumentFlow, BackDocumentCapture, DocumentBackConfirm]
  }
  return frontDocumentFlow
}

const crossDeviceSteps = (steps) => {
  const baseSteps = [{'type': 'crossDevice'}]
  const completeStep = Array.find(steps, isComplete)
  return hasCompleteStep(steps) ? [...baseSteps, completeStep] : baseSteps
}

const crossDeviceComponents = {
  crossDevice: () => [CrossDeviceIntro, CrossDeviceLink, MobileFlow],
  complete: () => [Complete]
}

const createComponentList = (components, steps) => {
  const mapSteps = (step) => createComponent(components, step)
  return shallowFlatten(steps.map(mapSteps))
}

const createComponent = (components, step) => {
  const {type} = step
  if (!(type in components)) { console.error('No such step: ' + type) }
  return components[type]().map(wrapComponent(step))
}

const wrapComponent = (step) => (component) => ({component, step})

const shallowFlatten = list => [].concat(...list)
