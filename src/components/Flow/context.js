import { h, Component } from 'preact'
import createContext from 'preact-context'

const { Provider, Consumer } = createContext()

export const FlowContextProvider = ({ children, ...valueProps }) => (
  <Provider value={valueProps}>
    {children}
  </Provider>
)

export const withFlowContext = WrappedComponent => props =>
  <Consumer>{
    contextProps => <WrappedComponent {...props} {...contextProps} />
  }
  </Consumer>
