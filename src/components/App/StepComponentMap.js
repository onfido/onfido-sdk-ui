import { h, Component } from 'preact'
import Welcome from '../Welcome'
import Select from '../Select'
import {FrontDocumentCapture, BackDocumentCapture, FaceCapture} from '../Capture'
import Complete from '../Complete'

const stepToComponents = (stepDefaultOptions, {type: stepType, options: stepOptions}) => {
  const optionExt = {...stepOptions, ...stepDefaultOptions};
  switch (stepType) {
    case 'document':
      return documentSteps(optionExt)
    case 'face':
      return <FaceCapture {...optionExt}/>
    case 'welcome':
      return <Welcome {...optionExt} />
    case 'complete':
      return <Complete {...optionExt} />
    default:
      return <div>Step "{stepType}" does not exist</div>
  }
};

const typeToStep = type => {return {type}};//{type} will not return an object with the property type, because {} are also used to establish a multi line function

const isStep = val => typeof val === 'object';

const formatStep = typeOrStep => isStep(typeOrStep) ?  typeOrStep : typeToStep(typeOrStep);

const stepToFormatToComponents = (stepDefaultOptions, step) => stepToComponents(stepDefaultOptions,formatStep(step));

const shallowFlattenList = list => [].concat(...list);

const stepsToComponents = (stepDefaultOptions, steps) => shallowFlattenList(steps.map( step => stepToFormatToComponents(stepDefaultOptions, step)));

const documentSteps = options => {
  let steps = [<Select {...options} />, <FrontDocumentCapture {...options} />]
  const two_sided_docs = ['driving_licence', 'national_identity_card']
  if (two_sided_docs.includes(options.documentType)) {
    console.log('Adding Reverse')
    steps.push(<BackDocumentCapture {...options} />)
  }
  return steps
}

export default { stepsToComponents };
