import { h, Component } from 'preact'
import { createPortal } from 'preact-compat';
import { withStepsContext, StepsContextProvider } from './context'
import classNames from 'classnames'
import theme from '../Theme/style.css'
import { prependSlash, ensureSingleSlash } from '../utils/string'

class Step extends Component {
  render() {
    const { portal, children } = this.props
    const child = children[0]
    return createPortal(child, document.querySelector(`#${portal}`))
  }
}

export default withStepsContext(Step)
