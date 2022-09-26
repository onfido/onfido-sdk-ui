/*
  Doesn't catch:
  - errors in asynchronous callbacks (setTimeout, setInterval etc)
  - errors that happen in the error boundary component itself
*/
import { Component } from 'preact'
import { captureException } from '~core/ExceptionHandler'

export class ErrorBoundary extends Component {
  state = {
    error: undefined,
  }

  static getDerivedStateFromError(error: Error) {
    return { error: error.message }
  }

  componentDidCatch(error: Error) {
    captureException(error)
  }

  render() {
    return this.props.children
  }
}
