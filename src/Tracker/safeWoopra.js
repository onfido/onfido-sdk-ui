function SafeWindow () {
  Object.keys(window).forEach(key => {
    Object.defineProperty(this, key,
      { get: () => {
        const value = window[key]
        if (typeof value === "function"){
          return value.bind(window)
        }
        if (key === "window") return this
        return value
      },
        set: value=>{ window[key] = value }
      }
    )
  })
}
SafeWindow.prototype = window;


const windowKey = "onfidoSafeWindow8xmy484y87m239843m20";
const safeWindow = window[windowKey] = new SafeWindow()
//Webpack needs the import to a literal string, it cannot be resolved at runtime, webpack needs a preprocessor
require("imports-loader?this=>onfidoSafeWindow8xmy484y87m239843m20,window=>onfidoSafeWindow8xmy484y87m239843m20!wpt/wpt.min.js")
delete window[windowKey]

export default safeWindow.WoopraTracker
