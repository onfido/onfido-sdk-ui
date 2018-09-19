import { h } from 'preact'
import createContext from 'preact-context'

const { Provider, Consumer } = createContext()

export const TreeContextProvider = ({ base, prev, next, children }) =>
  <Provider value={{ next, prev, base }}>
    {children}
  </Provider>

export const withTreeContext = WrappedComponent => props =>
  <Consumer>{
    more => <WrappedComponent {...more} {...props} />
  }
  </Consumer>
