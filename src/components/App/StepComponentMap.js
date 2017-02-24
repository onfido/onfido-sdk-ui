import { h, Component } from 'preact'
import Welcome from '../Welcome'
import Select from '../Select'
import Capture from '../Capture'
import Complete from '../Complete'

const stepToComponents = (stepDefaultOptions, {type: stepType, options: stepOptions}) => {
  const optionExt = {...stepOptions, ...stepDefaultOptions};
  switch (stepType) {
    case 'document':
      return [<Select method='document' {...optionExt} />,
              <DocumentCapture {...optionExt} />]
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

class DocumentCapture extends Component {
  render (options) {
    return <Capture method='document' autoCapture={true} {...options} />
  }
}

DocumentCapture.defaultProps = {
  useWebcam: false
}

class FaceCapture extends Component {
  render (options) {
    return <Capture method='face' autoCapture={false} {...options} />
  }
}

FaceCapture.defaultProps = {
  useWebcam: true
}

export default { stepsToComponents };
