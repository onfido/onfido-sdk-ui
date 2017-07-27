import { h, Component } from 'preact'
import createHistory from 'history/createBrowserHistory'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { unboundActions, events } from '../../core'
import {sendScreen} from '../../Tracker'

import { createComponentList } from './StepComponentMap'

const history = createHistory()

class Router extends Component {
  initialState = { step: 0 }

  constructor(props) {
    super(props)
    this.state = this.initialState
    this.unlisten = history.listen(({state = this.initialState}) => {
      this.setState(state)
    })
  }

  nextStep = () => {
    const currentStep = this.state.step
    this.setStepIndex(currentStep + 1)
  }

  setStepIndex = (newStepIndex) => {
    const steps = this.createComponentListFromProps(this.props)
    if (steps.length === newStepIndex){
      events.emit('complete')
    }
    else {
      const newStep = steps[newStepIndex]
      sendScreen(newStep.screenName)
      const state = { step: newStepIndex }
      const path = `${location.pathname}${location.search}${location.hash}`
      history.push(path, state)
    }
  }

  componentWillMount () {
    this.setStepIndex(this.state.step)
  }

  componentWillUnmount () {
    this.unlisten()
  }

  stepOptions = (steps) => (steps || ['welcome','document','face','complete']).map(formatStep)

  createComponentList = (steps, documentType) => createComponentList(this.stepOptions(steps), documentType)
  createComponentListFromProps = ({documentType, options:{steps}}) => this.createComponentList(steps, documentType)

  render = ({options: {steps, ...userOptions}, ...otherProps}) => {
    const componentList = this.createComponentList(steps, otherProps.documentType)
    const componentBlob = componentList[this.state.step]
    const CurrentComponent = componentBlob.component

    return (
      <div>
        <CurrentComponent
            {...{...componentBlob.options, ...userOptions, ...otherProps}}
            nextStep = {this.nextStep}/>
      </div>
    )
  }
}

const typeToStep = type => ({type})

const isStep = val => typeof val === 'object'

const formatStep = typeOrStep => isStep(typeOrStep) ?  typeOrStep : typeToStep(typeOrStep)

function mapStateToProps(state) {
  return {...state.globals}
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(unboundActions, dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(Router)
