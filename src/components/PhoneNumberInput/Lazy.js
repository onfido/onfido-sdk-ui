import { h, Component } from 'preact'
import {localised} from '../../locales'
import style from './style.css'

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
if (!window.Promise ){
  window.Promise = _Promise
}

const Loading = localised(({ translate }) =>
  <div className={style.loading}>{translate('cross_device.loading')}</div>
)

class PhoneNumberInputLazy extends Component {
  constructor(props){
    super(props)
    this.state = {component: Loading}
    // This is the first step toward the implementation of code splitting and lazy loading for the cross device feature
    // For now we are only separating the mobile number validation from the main bundle
    // but we are aiming to extract the cross device feature into
    // a separate bundle that can be lazy loaded on demand, to avoid bloating the loading time of the browser page

    import(/* webpackChunkName: "crossDevice" */ './index.js').then(component => {
      this.setState({component:component.default})
    }).catch(() => props.translate('errors.lazy_loading.message'));
  }

  render = (props)=> <this.state.component {...props}/>
}

export default localised(PhoneNumberInputLazy)
