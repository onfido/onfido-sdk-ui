import AudioRecorder from 'audio-recorder-polyfill'
if (!window.MediaRecorder) {
  window.MediaRecorder = AudioRecorder
}
