import { h, render, Component } from 'preact'
import createHistory from 'history/createBrowserHistory'
import App from '../App'

const history = createHistory()

class AppRouter extends Component {
  initialState = { step: 0 }

  constructor(props) {
    super(props)
    this.setState(this.initialState)
    this.unlisten = history.listen(({state = this.initialState}) => {
      this.setState(state)
    })
  }

  nextStep = () => {
    const state = { step: this.state.step + 1 }
    const path = `${location.pathname}${location.search}${location.hash}`
    history.push(path, state)
  }

  componentWillUnmount () {
    this.unlisten()
  }

  render = (props) =>
    <App
      {...props}
      nextStep={this.nextStep}
      step={this.state.step}
    />
}

export default AppRouter
