import { h, Component } from 'preact'
import { route } from 'preact-router'
import classNames from 'classnames'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
  unboundActions,
  store,
  events,
  selectors
} from 'onfido-sdk-core'
import {stepsToComponents} from './StepComponentMap'
import Error from '../Error'

const App = ({ websocketErrorEncountered, step, options, socket, ...otherProps }) => {
    const stepIndex = step || 0;

    const stepDefaultOptions = {
      prevLink: `/step/${(parseInt(stepIndex, 10) - 1 || 1)}/`,
      nextLink: `/step/${(parseInt(stepIndex, 10) + 1 || 1)}/`,
      socket,
      step,
      ...otherProps
    }
    const stepsToComponentsWithDefaultOptions = steps => stepsToComponents(stepDefaultOptions, steps)
    const defaultSteps = ['welcome','document','face','complete']
    const stepComponents = stepsToComponentsWithDefaultOptions(options.steps || defaultSteps)

    return (
      <div>
        <Error visible={websocketErrorEncountered}/>
        {stepComponents[stepIndex] || <div>Error: Step Missing</div>}
      </div>
    )
}

const {
  hasUnprocessedCaptures,
  areAllCapturesInvalid,
  isThereAValidCapture,
  validCaptures,
  unprocessedCaptures
} = selectors

function mapStateToProps(state) {
  return {
    unprocessedCaptures: unprocessedCaptures(state),
    hasUnprocessedCaptures: hasUnprocessedCaptures(state),
    areAllCapturesInvalid: areAllCapturesInvalid(state),
    isThereAValidCapture: isThereAValidCapture(state),
    validCaptures: validCaptures(state),
    ...state.globals
  }
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(unboundActions, dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
