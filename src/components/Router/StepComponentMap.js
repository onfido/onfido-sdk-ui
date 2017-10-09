import { h } from 'preact'

import Welcome from '../Welcome'
import Select from '../Select'
import {FrontDocumentCapture, BackDocumentCapture, FaceCapture} from '../Capture'
import {DocumentFrontConfirm, DocumentBackConfrim, FaceConfirm} from '../Confirm'
import Complete from '../Complete'
import MobileFlow from '../crossDevice/MobileFlow'
import CrossDeviceLink from '../crossDevice/CrossDeviceLink'
import CrossDeviceClientSuccess from '../crossDevice/ClientSuccess'

export const componentsList = ({flow, documentType, steps}) => {
  const hasComplete = steps[steps.length -1].type === 'complete'
  return flow === 'captureSteps' ?
    createComponentList(captureStepsComponents(documentType, steps), steps) :
    createComponentList(crossDeviceComponents(hasComplete), mobileSteps)
}

const captureStepsComponents = (documentType, steps) => {
  const successStep = lastCaptureStep(steps)
  const initialSteps = {
    welcome: () => [Welcome],
    face: () => [FaceCapture, FaceConfirm],
    document: () => createDocumentComponents(documentType)
  }
  return {...initialSteps, ...successStep}
}

const lastCaptureStep = (steps) => {
  if (steps[steps.length - 1].type === 'complete') return {complete: () => [Complete]}
  if (steps[steps.length - 1].type === 'clientSuccess') return {clientSuccess: () => [CrossDeviceClientSuccess]}
}

const createDocumentComponents = (documentType) => {
  const double_sided_docs = ['driving_licence', 'national_identity_card']
  const frontDocumentFlow = [Select, FrontDocumentCapture, DocumentFrontConfirm]
  if (Array.includes(double_sided_docs, documentType)) {
    return [...frontDocumentFlow, BackDocumentCapture, DocumentBackConfrim]
  }
  return frontDocumentFlow
}

const crossDeviceComponents = (hasComplete) => {
  const baseComponents = [CrossDeviceLink, MobileFlow]
  const components = hasComplete ? [...baseComponents, Complete] : baseComponents
  return {
    CrossDevice: () => components
  }
}

const mobileSteps = [{'type': 'CrossDevice'}]

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
