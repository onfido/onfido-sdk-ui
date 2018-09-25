import { h } from 'preact'
import { PureComponent, createPortal } from 'preact-compat'
import { withFlowContext } from './context'

class Node extends PureComponent {
  render() {
    const { children, portal, name } = this.props
    return createPortal(children, document.getElementById('portal'))
  }
}

export default withFlowContext(Node)