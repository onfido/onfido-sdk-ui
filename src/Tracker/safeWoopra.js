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

const safeWindow = window[process.env.WOOPRA_WINDOW_KEY] = new SafeWindow()
require(`imports-loader?this=>${process.env.WOOPRA_WINDOW_KEY},window=>${process.env.WOOPRA_WINDOW_KEY}!wpt/wpt.min.js`)
delete window[process.env.WOOPRA_WINDOW_KEY]

export default safeWindow.WoopraTracker
