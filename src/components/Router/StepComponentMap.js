import { h, Component } from 'preact'
import { events } from 'onfido-sdk-core'

import Welcome from '../Welcome'
import Select from '../Select'
import {FrontDocumentCapture, BackDocumentCapture, FaceCapture} from '../Capture'
import Complete from '../Complete'

export const createComponentList = (stepOptions, componentOptions) => {
  const formattedStepOptions = shallowFlatten(stepOptions.map(formatStep))
  const stepCount = formattedStepOptions.length
  const mapSteps = (step, index) => {
    const options = {step, componentOptions}
    if (stepCount === index + 1) {
      options.finalStep = true
    }
    return createComponent(options)
  }
  return shallowFlatten(formattedStepOptions.map(mapSteps))
}

const createDocumentComponents = (options, finalStep) => {
  const finalOptions = finalStep ? {...options, nextStep: onFinalStep} : options
  const double_sided_docs = ['driving_licence', 'national_identity_card']
  if (double_sided_docs.indexOf(options.documentType) !== -1) {
    return [<Select {...options}/>,
            <FrontDocumentCapture {...options}/>,
            <BackDocumentCapture {...finalOptions}/>]
  }
  return [<Select {...options}/>, <FrontDocumentCapture {...finalOptions}/>]
}

const createComponent = ({step, componentOptions, finalStep}) => {
  const options = {...step, ...componentOptions}
  if (finalStep && step.type !== 'document') options.nextStep = onFinalStep
  const stepMap = {
    welcome: () => <Welcome {...options}/>,
    face: () => <FaceCapture {...options}/>,
    document: () => createDocumentComponents(options, finalStep),
    complete: () => <Complete {...options} />
  }
  if (!(step.type in stepMap)) { console.error('No such step: ' + step.type) }
  return stepMap[step.type]()
}

const onFinalStep = () => {
  events.emit('complete')
}

// {type} will not return an object with the property type, because {} are also
// used to establish a multi line function
const typeToStep = type => {return {type}}

const isStep = val => typeof val === 'object'

const formatStep = typeOrStep => isStep(typeOrStep) ?  typeOrStep : typeToStep(typeOrStep)

const shallowFlatten = list => [].concat(...list)
