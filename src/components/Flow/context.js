import { h, Component } from 'preact'
import createContext from 'preact-context'
import { stripLeadingSlash, prependSlash, ensureSingleSlash } from '../utils/string'

const makeContextProvider = Provider => ({ children, ...valueProps }) => (
  <Provider value={valueProps}>
    {children}
  </Provider>
)

const withContext = Consumer => WrappedComponent => props =>
  <Consumer>{
    contextProps => <WrappedComponent {...props} {...contextProps} />
  }
  </Consumer>

const nodeContext = createContext()
const flowContext = createContext()

export default {
  NodeContextProvider: makeContextProvider(nodeContext.Provider),
  withNodeContext: withContext(nodeContext.Consumer),
  FlowContextProvider: makeContextProvider(flowContext.Provider),
  withFlowContext: withContext(flowContext.Consumer),
}