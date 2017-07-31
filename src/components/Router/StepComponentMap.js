import { h, Component } from 'preact'
import Welcome from '../Welcome'
import Select from '../Select'
import {FrontDocumentCapture, BackDocumentCapture, FaceCapture} from '../Capture'
import Complete from '../Complete'

export const createComponentList = (steps, documentType) => {
  const mapSteps = (step) => createComponent(step, documentType)
  return shallowFlatten(steps.map(mapSteps))
}

const createComponent = (step, documentType) => {
  const wrapComponentB = wrapComponent(step)
  const stepMap = {
    welcome: () => wrapComponentB(Welcome),
    face: () => wrapComponentB(FaceCapture, `capture`),
    document: () => createDocumentComponents(step, documentType),
    complete: () => wrapComponentB(Complete)
  }
  const {type} = step
  if (!(type in stepMap)) { console.error('No such step: ' + type) }
  return stepMap[type]()
}

const createDocumentComponents = (step, documentType) => {
  const wrapComponentB = wrapComponent(step)
  const double_sided_docs = ['driving_licence', 'national_identity_card']
  const frontDocumentFlow = [
    wrapComponentB(Select, "type_select"),
    wrapComponentB(FrontDocumentCapture, "capture_front")]

  if (double_sided_docs.indexOf(documentType) !== -1) {
    return [
      ...frontDocumentFlow,
      wrapComponentB(BackDocumentCapture, "capture_back")]
  }
  return frontDocumentFlow
}

const wrapComponent = ({options: stepOption, type: stepType}) =>
                        (component, screenName) =>
                          ({component, stepOption, stepType, screenName})

const shallowFlatten = list => [].concat(...list)
