// @ts-nocheck
// Extend Preact internals to catch errors from props with type function
import { options, VNode } from 'preact'

export const extendPreact = () => {
  // Preact source: https://github.com/preactjs/preact/blob/10.8.1/src/create-element.js#L55
  options.vnode = (vnode: VNode) => {
    for (const i: number in vnode.props) {
      if (typeof vnode.props[i] === 'function')
        vnode.props[i] = wrapFunctionProperty(vnode.props[i], vnode)
    }
  }

  const wrapFunctionProperty = (functionProperty, vnode: VNode) => (
    ...args
  ) => {
    let returnValue
    try {
      returnValue = functionProperty.apply(vnode, args)
    } catch (error) {
      // options.__e is options._catchError on Preact source code
      // Searching for parent node with ErrorBoundary and passes error
      try {
        options.__e(error, vnode)
      } catch (e) {
        // Prevent already catched errors being send to the console.
        if (error !== e) {
          throw e
        }
      }
    }
    return returnValue
  }
}
