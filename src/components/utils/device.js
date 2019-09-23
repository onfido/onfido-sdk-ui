let originalPosition = null
let newPosition = null
let hasPositionChanged = false

export const startListeningMotion = () => {
  window.addEventListener('devicemotion', (event) => {
    const { acceleration, accelerationIncludingGravity, rotationRate } = event
    if (!originalPosition) {
      originalPosition = {
        acceleration,
        accelerationIncludingGravity,
        rotationRate
      }
    } else {
      newPosition = {
        acceleration,
        accelerationIncludingGravity,
        rotationRate
      }
      hasPositionChanged = newPosition.acceleration !== originalPosition.acceleration || newPosition.accelerationIncludingGravity !== originalPosition.accelerationIncludingGravity || newPosition.rotationRate !== originalPosition.rotationRate
    }
  })
}

export const motionDetected = () => {
  console.log('removing devicemotion listener')
  window.removeEventListener('devicemotion')
  return hasPositionChanged
}
