let initialOrientation = null
let newOrientation = null
let orientationChanged = false

let initialMotion = null
let newMotion = null
let motionChanged = false

const handleDeviceOrientationEvent = (frontToBack, leftToRight, rotateDegrees) => {
  if (!initialOrientation) {
    initialOrientation = {
      frontToBack, leftToRight, rotateDegrees
    }
  } else {
    newOrientation = {
      frontToBack, leftToRight, rotateDegrees
    }
    console.log('newOrientation', newOrientation)
    orientationChanged = newOrientation !== initialOrientation
  }
}

const handleDeviceMotionEvent = (acceleration, accelerationIncludingGravity, rotationRate) => {
  if (!initialMotion) {
    initialMotion = {
      acceleration,
      accelerationIncludingGravity,
      rotationRate
    }
    console.log('initialMotion', initialMotion)
  } else {
    newMotion = {
      acceleration,
      accelerationIncludingGravity,
      rotationRate
    }
    console.log('newMotion', newMotion)
    motionChanged = newMotion !== initialMotion
  }
}

export const startDetectingMovement = () => {
  if (window.DeviceOrientationEvent) {
    console.log('DeviceOrientationEvent')
    window.addEventListener("deviceorientation", (event) => {
        const rotateDegrees = event.alpha;
        const leftToRight = event.gamma;
        const frontToBack = event.beta;
        console.log(frontToBack, leftToRight, rotateDegrees)
        handleDeviceOrientationEvent(frontToBack, leftToRight, rotateDegrees);
    }, true);
  }

  if (window.DeviceMotionEvent) {
    window.addEventListener('devicemotion', (event) => {
      console.log('devicemotion event fired')
      const { acceleration, accelerationIncludingGravity, rotationRate } = event
      handleDeviceMotionEvent(acceleration, accelerationIncludingGravity, rotationRate)
    }, true)
  }
}

export const stopDetectingMovement = () => {
  window.removeEventListener('devicemotion')
  window.removeEventListener('deviceorientation')
}

export const movementDetectionResults = {
  initialOrientation,
  newOrientation,
  orientationChanged,
  initialMotion,
  newMotion,
  motionChanged
}
