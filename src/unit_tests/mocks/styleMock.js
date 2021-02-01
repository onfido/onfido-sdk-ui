/**
 * identity-object-proxy is a solution to mock CSS Modules styles,
 * but it doesn't work with Sass variables.
 * We combined the original identity-object-proxy implementation
 * with our custom variables to make it work for both Css & Sass
 * Original idea: https://github.com/keyz/identity-obj-proxy/issues/12
 */
const idObj = new Proxy(
  {},
  {
    get: function getter(_target, key) {
      if (key === '__esModule') return false
      if (key === 'modal_animation_duration') return '10ms'
      return key
    },
  }
)

export default idObj
