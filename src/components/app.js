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

class App extends Component {

  componentWillMount () {
    const { token } = this.props.options
    this.socket = ws(token)
  }

  render () {
    const { websocketErrorEncountered, options } = this.props
    const step = this.props.step || 0;

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
    const defaults = {
      prevLink: `/step/${(parseInt(step, 10) - 1 || 1)}/`,
      nextLink: `/step/${(parseInt(step, 10) + 1 || 1)}/`,
      ...this.props
    }

    const stepsDefault = ['welcome','document-selector','document','face','complete']

    const stepType = ({type, options}) => {
      const optionExt = Object.assign({}, options, defaults);
      switch (type) {
        case 'document':
          return <Capture method='document' {...optionExt} autoCapture={true} socket={this.socket} />
        case 'document-selector':
          return <Select method='document' {...optionExt} />
        case 'face':
          return <Capture method='face' {...optionExt} autoCapture={false} socket={this.socket} />
        case 'welcome':
          return <Welcome {...optionExt} />
        case 'complete':
          return <Complete {...optionExt} />
        default:
          return <div></div>
      }
    }

    const formatStepType = typeArg => typeof typeArg === 'object' ?  typeArg : {type:typeArg};

    const stepTypeLoose = stepOption => stepType(formatStepType(stepOption));

    const mapStepsLoose = steps => steps.map( stepTypeLoose )

    const steps = options.steps ? mapStepsLoose(options.steps) : mapStepsLoose(stepsDefault);

    return (
      <div>
        {conditionalServerError}
        {steps[step] || <div>Error: Step Missing</div>}
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
