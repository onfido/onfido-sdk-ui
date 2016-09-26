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
import {stepsToComponents} from './StepComponentMap'
import Error from '../Error'

class App extends Component {

  componentWillMount () {
    const { token } = this.props.options
    this.socket = ws(token)
  }

  componentWillReceiveProps (nextProps) {
    const nextToken = nextProps.options.token
    if (this.props.options.token !== nextToken){
      this.socket = ws(nextToken)
    }
  }

  render () {
    const { websocketErrorEncountered, options } = this.props
    const stepIndex = this.props.step || 0;

    const stepDefaultOptions = {
      prevLink: `/step/${(parseInt(stepIndex, 10) - 1 || 1)}/`,
      nextLink: `/step/${(parseInt(stepIndex, 10) + 1 || 1)}/`,
      socket: this.socket,
      ...this.props
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

}

const {
  documentCaptured,
  faceCaptured,
  documentSelector,
  faceSelector,
  unprocessedDocuments
} = selectors

function mapStateToProps(state) {
  return {
    documentCaptures: documentSelector(state),
    faceCaptures: faceSelector(state),
    documentCaptured: documentCaptured(state),
    faceCaptured: faceCaptured(state),
    unprocessedDocuments: unprocessedDocuments(state),
    ...state.globals
  }
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(unboundActions, dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
