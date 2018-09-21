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
  
const { Provider: NodeProvider, Consumer: NodeConsumer } = createContext()

export const NodeContextProvider = makeContextProvider(NodeProvider)
export const withNodeContext = withContext(NodeConsumer)

const { Provider: FlowProvider, Consumer: FlowConsumer } = createContext()

export const FlowContextProvider = makeContextProvider(FlowProvider)
export const withFlowContext = withContext(FlowConsumer)
