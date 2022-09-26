import { trackException } from 'Tracker'

const MediaRecorder = window.MediaRecorder

const handleDataAvailable = (event: BlobEvent, recordedBlobs: Array<Blob>) => {
  if (event.data && event.data.size > 0) {
    recordedBlobs.push(event.data)
  }
}

const handleStop = (event: Event) => {
  debugConsole('Recorder stopped: ', event)
}

const videoOptions = () => {
  // TODO, These values are the same the MediaRecorder should have by default.
  // We identified that in recent Safari versions the defaults were not being respected
  // thus we have to add them here to ensure we control the bitrate and keep file sizes reasonable.
  //
  // Future improvement would be to make these configurable thru the webcam component if we have
  // different scenarios that require different bitrates on the web sdk
  const bitRate = {
    audioBitsPerSecond: 128000,
    videoBitsPerSecond: 2500000,
  }
  const mimeTypes = [
    'video/webm;codecs=vp8,opus',
    'video/webm;codecs=vp8',
    'video/webm;codecs=vp9',
    'video/webm',
  ]
  let mimeType = ''
  for (const type in mimeTypes) {
    if (MediaRecorder.isTypeSupported(mimeTypes[type])) {
      mimeType = mimeTypes[type]
      break
    } else {
      debugConsole(`${mimeTypes[type]} is not Supported`)
    }
  }
  return {
    ...bitRate,
    mimeType: mimeType ? mimeType : '',
  }
}

export const createMediaRecorder = (
  stream: MediaStream | undefined
): MediaRecorder | undefined => {
  if (!stream) return
  const options = videoOptions()
  try {
    return new MediaRecorder(stream, options)
  } catch (e) {
    logError(e)
    return
  }
}

export const startRecording = (mediaRecorder: MediaRecorder) => {
  const recordedBlobs: Array<Blob> = []
  mediaRecorder.onstop = handleStop
  mediaRecorder.ondataavailable = (e) => handleDataAvailable(e, recordedBlobs)
  mediaRecorder.start(10) // collect 10ms of data
  debugConsole('MediaRecorder started', mediaRecorder)
  return recordedBlobs
}

export const debugConsole = (...args: any[]) => {
  if (process.env.NODE_ENV === 'development') console.log(...args)
}

export const logError = (e: any) => {
  if (process.env.NODE_ENV === 'development') console.error(e)
  let message
  if (e instanceof Error) message = e.message
  else message = String(e)
  trackException('react-webcam error: ' + message)
}
