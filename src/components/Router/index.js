import { h, render, Component } from 'preact'
import App from '../App'

class AppRouter extends Component {
  constructor(props) {
    super(props)
    this.setState({ step: 0 })
  }

  nextCallback = () => {
    const step = { step: this.state.step + 1 }
    this.setState(step)
  }

  prevCallback = () => {
    const step = { step: this.state.step - 1 }
    this.setState(step)
  }

  render = (props) =>
    <App
      {...props}
      nextCallback={this.nextCallback}
      prevCallback={this.prevCallback}
      step={this.state.step}
    />
}

export default AppRouter
