import { h, Component } from 'preact'
import { Router, route } from 'preact-router'
import classNames from 'classnames'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { unboundActions, store, events } from 'onfido-sdk-core'

import Select from './Select'
import Capture from './Capture'
import Welcome from './Welcome'
import screenWidth from './utils/screenWidth'

import styles from '../style/style.css'

class App extends Component {

  prevPage = () => {
    const newStep = parseInt(this.props.step, 10)
    route(`/step/${newStep - 1}`, true)
  }

  nextPage = () => {
    const newStep = parseInt(this.props.step, 10)
    route(`/step/${newStep + 1}`, true)
  }

  render () {
    const { socket } = this
    const { step } = this.props
    const actions = {
      prevPage: this.prevPage,
      nextPage: this.nextPage
    }
    const steps = [
      // :step/0
      <Welcome {...this.props} />,
      // :step/1
      <Select method='document' {...this.props} {...actions}/>,
      // :step/2
      <Capture method='document' socket={socket} {...this.props} {...actions}/>,
      // :step/3
      <Select method='face' {...this.props} {...actions}/>
    ]
    const [ first ] = steps
    return (
      <div>
        {step && steps[step] || first}
      </div>
    )
  }

}

function mapStateToProps(state) {
  return {
    documentCaptures: state.documentCaptures,
    faceCaptures: state.faceCaptures,
    ...state.globals
  }
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(unboundActions, dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
