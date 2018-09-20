import { h } from 'preact'
import createContext from 'preact-context'

const { Provider, Consumer } = createContext()

export const StepsContextProvider = ({ base, prev, next, portal, children }) =>
  <Provider value={{ next, prev, base, portal }}>
    {children}
  </Provider>

export const withStepsContext = WrappedComponent => props =>
  <Consumer>{
    more => <WrappedComponent {...more} {...props} />
  }
  </Consumer>
