class WoopraTracker {
  init() {
    console.log('invoke WoopraTracker.init')
  }
  config() {
    console.log('invoke WoopraTracker.config')
  }
  identify() {
    console.log('invoke WoopraTracker.identify')
  }
  track() {
    console.log('invoke WoopraTracker.track')
  }
  dispose() {
    console.log('invoke WoopraTracker.dispose')
  }
}

module.exports = WoopraTracker
