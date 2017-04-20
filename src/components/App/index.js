import { h, Component } from 'preact'
import classNames from 'classnames'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { unboundActions, events } from 'onfido-sdk-core'
import { steps, components } from './StepComponentMap'
import Error from '../Error'

const App = ({ websocketErrorEncountered, step, options, socket, ...otherProps }) => {
  const componentOptions = {
    socket,
    step,
    ...otherProps
  }
  const defaultStepOptions = ['welcome','document','face','complete']
  const stepOptions = options.steps || defaultStepOptions
  const stepList = steps(stepOptions, componentOptions.documentType)

  if (step + 1 >=  stepList.length) componentOptions.nextStep = finalStep
  const componentList = components(stepList, componentOptions)

  return (
    <div>
      <Error visible={websocketErrorEncountered}/>
      {componentList[step]}
    </div>
  )
}

function finalStep() {
  events.emit('complete')
}

function mapStateToProps(state) {
  return {...state.globals}
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(unboundActions, dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
