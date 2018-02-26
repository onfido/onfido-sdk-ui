import { h } from 'preact'

import Welcome from '../Welcome'
import Select from '../Select'
import {FrontDocumentCapture, BackDocumentCapture, FaceCapture} from '../Capture'
import {DocumentFrontConfirm, DocumentBackConfrim, FaceConfirm} from '../Confirm'
import Complete from '../Complete'
import MobileFlow from '../crossDevice/MobileFlow'
import CrossDeviceLink from '../crossDevice/CrossDeviceLink'
import ClientSuccess from '../crossDevice/ClientSuccess'

export const componentsList = ({flow, documentType, steps, mobileFlow}) => {
  const captureSteps = mobileFlow ? clientCaptureSteps(steps) : steps
  return flow === 'captureSteps' ?
    createComponentList(captureStepsComponents(documentType, mobileFlow), captureSteps) :
    createComponentList(crossDeviceComponents, crossDeviceSteps(steps))
}

const hasCompleteStep = (steps) => steps.some(step => step.type === 'complete')

const clientCaptureSteps = (steps) =>
  hasCompleteStep(steps) ? steps : [...steps, {type: 'complete'}]

const captureStepsComponents = (documentType, mobileFlow) => {
  const complete = mobileFlow ? [ClientSuccess] : [Complete]
  return {
    welcome: () => [Welcome],
    face: () => [FaceCapture, FaceConfirm],
    document: () => createDocumentComponents(documentType),
    complete: () => complete
  }
}

const createDocumentComponents = (documentType) => {
  const double_sided_docs = ['driving_licence', 'national_identity_card']
  const frontDocumentFlow = [Select, FrontDocumentCapture, DocumentFrontConfirm]
  if (Array.includes(double_sided_docs, documentType)) {
    return [...frontDocumentFlow, BackDocumentCapture, DocumentBackConfrim]
  }
  return frontDocumentFlow
}

const crossDeviceSteps = (steps) => {
  const baseSteps = [{'type': 'crossDevice'}]
  const completeStep = steps.find((step) => step.type === 'complete')
  return hasCompleteStep(steps) ? [...baseSteps, completeStep] : [...baseSteps]
}

const crossDeviceComponents = {
  crossDevice: () => [CrossDeviceLink, MobileFlow],
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
