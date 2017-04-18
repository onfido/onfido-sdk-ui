import { h, Component } from 'preact'
import Welcome from '../Welcome'
import Select from '../Select'
import {FrontDocumentCapture, BackDocumentCapture, FaceCapture} from '../Capture'
import Complete from '../Complete'

export const steps = (stepOptions, documentType) => {
  const mapOptions = stepOption => stepOptionToStep(stepOption, documentType)
  return shallowFlatten(stepOptions.map(mapOptions))
}

export const components = (stepList, componentOptions) => {
  const mapSteps = step => stepToComponents(step, componentOptions)
  return stepList.map(mapSteps)
}

const stepOptionToStep = (stepOption, documentType) => {
  const step = formatStep(stepOption)
  return step.type === 'document' ? documentStepsList(step.options, documentType) : step
}

const documentStepsList = (options, documentType) => {
  const steps = [{type: 'documentSelect', ...options},
                 {type: 'documentFront', ...options}]
  if (['driving_licence', 'national_identity_card'].includes(documentType)) {
    steps.push({type: 'documentBack', ...options})
  }
  return steps
}

const stepToComponents = (step, componentOptions) => {
  const options = {...step, ...componentOptions}
  const stepMap = {
    welcome: <Welcome {...options}/>,
    face: <FaceCapture {...options}/>,
    documentSelect: <Select {...options}/>,
    documentFront: <FrontDocumentCapture {...options}/>,
    documentBack: <BackDocumentCapture {...options}/>,
    complete: <Complete {...options}/>
  }
  if (!(step.type in stepMap)) { console.error('No such step: ' + step.type) }
  return stepMap[step.type]
}

// {type} will not return an object with the property type, because {} are also
// used to establish a multi line function
const typeToStep = type => {return {type}}

const isStep = val => typeof val === 'object'

const formatStep = typeOrStep => isStep(typeOrStep) ?  typeOrStep : typeToStep(typeOrStep)

const shallowFlatten = list => [].concat(...list)
