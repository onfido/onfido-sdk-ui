import { h, Component } from 'preact'
import createContext from 'preact-context'

const { Provider, Consumer } = createContext()

export const FlowContextProvider = ({ base, prev, next, portal, children }) => (
  <Provider value={{ next, prev, base, portal }}>
    {children}
  </Provider>
)

export const withFlowContext = WrappedComponent => props =>
  <Consumer>{
    contextProps => <WrappedComponent {...props} {...contextProps} />
  }
  </Consumer>
