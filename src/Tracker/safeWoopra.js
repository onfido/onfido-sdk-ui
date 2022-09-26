/*
Safe window is a proxy object of window
It has the same functionality as window,
however changing its properties won't affect
the global window object.
*/

function SafeWindow() {
  const propertyKeys = new Set()

  /*
  For loop is being used instead of Object.keys()
  This is because depending on the browser,
  certain apis are part of the prototype,
  rather than the Window instance

  IE11 is one of the browsers that needs the for loop
  */
  /* eslint-disable guard-for-in */
  for (const key in window) {
    propertyKeys.add(key)
  }

  /* In Salesforce, some needed properties are not returned by ForIn */
  for (const key of Object.getOwnPropertyNames(window)) {
    propertyKeys.add(key)
  }

  for (const key of propertyKeys) {
    Object.defineProperty(this, key, {
      get: () => {
        const value = window[key]
        if (typeof value === 'function') {
          return value.bind(window)
        }
        if (key === 'window') return this
        return value
      },
      set: (value) => {
        window[key] = value
      },
    })
  }
}

SafeWindow.prototype = Window.prototype

// We create a global instance of safe window, so that imports-loader
// Can refer to it
const safeWindow = (Window.prototype[
  process.env.WOOPRA_WINDOW_KEY
] = new SafeWindow())

//The goal is to import Woopra in such a way that it doesn't pollute the global window, hence why we pass an instance of SafeWindow to imports-loader
require(process.env.WOOPRA_IMPORT)

// We delete the global reference since imports-loader no longer needs it
delete Window.prototype[process.env.WOOPRA_WINDOW_KEY]

export default safeWindow.WoopraTracker
