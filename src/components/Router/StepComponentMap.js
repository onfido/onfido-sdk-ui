import { h } from 'preact'

import Welcome from '../Welcome'
import Select from '../Select'
import {FrontDocumentCapture, BackDocumentCapture, FaceCapture} from '../Capture'
import {DocumentFrontConfirm, DocumentBackConfrim, FaceConfirm} from '../Confirm'
import Complete from '../Complete'
import MobileLink from '../crossDevice/MobileLink'
import MobileFlowInProgress from '../crossDevice/MobileFlowInProgress'
import MobileFlowComplete from '../crossDevice/MobileFlowComplete'

export const componentsList = ({flow, documentType, steps}) => {
  return flow === 'master' ?
    createComponentList(masterFlowComponents(documentType), steps) :
    createComponentList(crossDeviceComponents, mobileSteps)
}

const masterFlowComponents = (documentType) => {
  return {
    welcome: () => [Welcome],
    face: () => [FaceCapture, FaceConfirm],
    document: () => createDocumentComponents(documentType),
    complete: () => [Complete]
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


const crossDeviceComponents = {
  mobileLink: () => [MobileLink],
  mobileConnection: () => [MobileFlowInProgress, MobileFlowComplete]
}

const mobileSteps = [{'type': 'mobileLink'}, {'type': 'mobileConnection'}]

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
