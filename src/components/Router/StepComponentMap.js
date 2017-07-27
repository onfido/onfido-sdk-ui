import { h, Component } from 'preact'
import Welcome from '../Welcome'
import Select from '../Select'
import {FrontDocumentCapture, BackDocumentCapture, FaceCapture} from '../Capture'
import Complete from '../Complete'

export const createComponentList = (steps, documentType) => {
  const mapSteps = (step) => createComponent(step, documentType)
  return shallowFlatten(steps.map(mapSteps))
}

const createComponent = ({type, options}, documentType) => {
  const wrapComponentB = wrapComponent(options)
  const stepMap = {
    welcome: () => wrapComponentB(Welcome, "welcome"),
    face: () => wrapComponentB(FaceCapture, "face_capture"),
    document: () => createDocumentComponents({type, options}, documentType),
    complete: () => wrapComponentB(Complete, "complete")
  }
  if (!(type in stepMap)) { console.error('No such step: ' + type) }
  return stepMap[type]()
}

const createDocumentComponents = ({type, options}, documentType) => {
  const wrapComponentB = wrapComponent(options)
  const double_sided_docs = ['driving_licence', 'national_identity_card']
  const frontDocumentFlow = [
    wrapComponentB(Select, "document_select"),
    wrapComponentB(FrontDocumentCapture, "document_capture_front")]

  if (double_sided_docs.indexOf(documentType) !== -1) {
    return [
      ...frontDocumentFlow,
      wrapComponentB(BackDocumentCapture, "document_capture_back")]
  }
  return frontDocumentFlow
}

const wrapComponent = (options) => (component, screenName) =>
  ({component,
    options,
    screenName: screenName ? screenName : component.name})

const shallowFlatten = list => [].concat(...list)
