import { h, Component } from 'preact'

/*
Necessary to polyfill Promise due to webpack dynamic import using it
see: https://webpack.js.org/api/module-methods/#import-

#HACK it's a hack because webpack should allow to just import Promise instead of consuming it from global.
We import core-js promise since it's the one used by babel runtime.
This way we avoid duplicate Promise implementation.

Discussion: https://github.com/webpack/webpack/issues/3531

Using this particular module, since it seems to be the one used by babel-runtime,
which means we are reusing code as much as possible.
 */
import _Promise from 'core-js-pure/features/promise'
if (!window.Promise) {
  window.Promise = _Promise
}

export const asyncComponent = (importComponent, AlternativeComponent) => {
  class AsyncComponent extends Component {
    constructor(props) {
      super(props)

      this.state = {
        component: null,
      }
    }

    lazyLoadingError = () =>
      this.props.translate('generic.errors.lazy_loading.message')

    async componentDidMount() {
      try {
        const { default: component } = await importComponent()
        this.setState({ component })
      } catch {
        this.setState({ component: this.lazyLoadingError })
      }
    }

    render() {
      const C = this.state.component

      return C ? <C {...this.props} /> : <AlternativeComponent />
    }
  }

  return AsyncComponent
}
