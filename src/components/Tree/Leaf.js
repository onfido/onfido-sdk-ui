import { h, Component } from 'preact'
import { withTreeContext, TreeContextProvider } from './context'
import classNames from 'classnames'
import theme from '../Theme/style.css'
import { prependSlash, ensureSingleSlash } from '../utils/string'

class Leaf extends Component {
  render() {
    const { children, next, prev, base, path } = this.props
    const child = children[0]
    return (
      <TreeContextProvider
        {...{ next, prev }}
        base={ ensureSingleSlash(`${base}${prependSlash(path)}`) }
      >
      { child }
      </TreeContextProvider>
    )
  }
}

export default withTreeContext(Leaf)
