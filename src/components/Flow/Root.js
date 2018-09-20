import { h, Component, cloneElement } from 'preact'
import { FlowContextProvider } from './context'

export default class Root extends Component {
  state = {
    hasPortal: false,
  }

  handlePortalMounted = () => {
    if (!this.state.hasPortal) {
      this.setState({ hasPortal: true })
    }
  }

  render() {
    const { children, onEnd, name } = this.props
    return (
      <FlowContextProvider base="/" next={onEnd} portal={name}>
        { this.state.hasPortal ? children : null }
        <div ref={ node => this.handlePortalMounted() } id={name} />
      </FlowContextProvider>
    )
  }
}