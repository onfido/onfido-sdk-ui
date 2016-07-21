import { h, Component } from 'preact'
import { route } from 'preact-router'
import classNames from 'classnames'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
  unboundActions,
  store,
  events,
  selectors,
  connect as ws
} from 'onfido-sdk-core'

import Welcome from './Welcome'
import Select from './Select'
import Capture from './Capture'
import Confirm from './Confirm'
import Complete from './Complete'

import styles from '../style/style.css'

const stepsToComponents = ( _ => {
  //Closure created to encapsulate the set of functionality

  const stepToComponent = (stepDefaultOptions, {type: stepType, options: stepOptions}) => {
    const optionExt = Object.assign({}, stepOptions, stepDefaultOptions);
    switch (stepType) {
      case 'document':
        return [<Select method='document' {...optionExt} />,
                <Capture method='document' {...optionExt} autoCapture={true}/>]
      case 'face':
        return <Capture method='face' {...optionExt} autoCapture={false}/>
      case 'welcome':
        return <Welcome {...optionExt} />
      case 'complete':
        return <Complete {...optionExt} />
      default:
        return <div>Step "{stepType}" does not exist</div>
    }
  }

  const typeToStep = type => {return {type}};//{type} will not return an object with the property type, because {} are also used to establish a multi line function

  const isStep = val => typeof val === 'object';

  const formatStep = typeOrStep => isStep(typeOrStep) ?  typeOrStep : typeToStep(typeOrStep);

  const stepToFormatToComponent = (stepDefaultOptions, step) => stepToComponent(stepDefaultOptions,formatStep(step));

  const shallowFlattenList = list => [].concat(...list);

  return (stepDefaultOptions, steps) => shallowFlattenList(steps.map( step => stepToFormatToComponent(stepDefaultOptions, step)));
})()

console.log(stepsToComponents);

class App extends Component {

  componentWillMount () {
    const { token } = this.props.options
    this.socket = ws(token)
  }

  render () {
    const { websocketErrorEncountered, options } = this.props
    const stepIndex = this.props.step || 0;

    const conditionalServerError = (
      <div
        className={'server-error' + (websocketErrorEncountered ? '' : ' hidden')}
      >
        <div>
          <p>There was an error connecting to the server</p>
          <p>Please wait and try again later</p>
        </div>
      </div>
    )
    const stepDefaultOptions = {
      prevLink: `/step/${(parseInt(stepIndex, 10) - 1 || 1)}/`,
      nextLink: `/step/${(parseInt(stepIndex, 10) + 1 || 1)}/`,
      socket: this.socket,
      ...this.props
    }

    const stepsDefault = ['welcome','document','face','complete']

    const stepsToComponentsWithDefaults = steps => stepsToComponents(stepDefaultOptions, steps);

    const stepComponents = options.steps ? stepsToComponentsWithDefaults(options.steps) : stepsToComponentsWithDefaults(stepsDefault);

    return (
      <div>
        {conditionalServerError}
        {stepComponents[stepIndex] || <div>Error: Step Missing</div>}
      </div>
    )
  }

}

const {
  documentCaptured,
  faceCaptured,
  documentSelector,
  faceSelector
} = selectors

function mapStateToProps(state) {
  return {
    documentCaptures: documentSelector(state),
    faceCaptures: faceSelector(state),
    documentCaptured: documentCaptured(state),
    faceCaptured: faceCaptured(state),
    ...state.globals
  }
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(unboundActions, dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
