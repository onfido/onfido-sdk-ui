function safeWindow () {
  Object.keys(window).forEach(key=>{
    if (typeof window[key] === "function"){
      this[key] = window[key].bind(window)
    }
    else if (key === "window"){
      //this.window = this
    }
    else {
      Object.defineProperty(this, key,
        { get: ()=> window[key],
          set: value=>{ window[key] = value }
        })
    }
  })
  console.log(this)
}
safeWindow.prototype = window;


const windowKey = "onfidoSafeWindow8xmy484y87m239843m20";
const safeWindow = window[windowKey] = new safeWindow()
//Webpack needs the import to a literal string, it cannot be resolved at runtime, webpack needs a preprocessor
require("imports-loader?this=>onfidoSafeWindow8xmy484y87m239843m20,window=>onfidoSafeWindow8xmy484y87m239843m20!wpt/wpt.min.js")
delete window[windowKey]

export default safeWindow.WoopraTracker
