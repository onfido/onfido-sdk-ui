import { h, Component } from 'preact'
import createContext from 'preact-context'
import { stripLeadingSlash, prependSlash, ensureSingleSlash } from '../utils/string'
import { withNodeContext, NodeContextProvider } from './context'

export const Node = withNodeContext(({ base, path, children }) =>
  <NodeContextProvider
    base={ ensureSingleSlash(`${ base }/${ path }`) }
  >
  {children[0]}
  </NodeContextProvider>
)