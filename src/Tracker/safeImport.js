function baseWindow () {
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
baseWindow.prototype = window;

const safeImport = (path,exportKeys) => {
  const windowKey = "onfidoSafeWindow8xmy484y87m239843m20";
  const safeWindow = window[windowKey] = new baseWindow()
  require("imports-loader?this=>onfidoSafeWindow8xmy484y87m239843m20,window=>onfidoSafeWindow8xmy484y87m239843m20!wpt/wpt.min.js")
  delete window[windowKey]
  
  return exportKeys.reduce((object, exportKey) => ({
    ...object,
    [exportKey]: safeWindow[exportKey]
  }), {})
}

export default safeImport
