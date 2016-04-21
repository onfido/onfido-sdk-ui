const supportsGetUserMedia = ('getUserMedia' in navigator || 'webkitGetUserMedia' in navigator || 'mozGetUserMedia' in navigator || 'msGetUserMedia' in navigator)

const supportsWebSockets = 'WebSocket' in window

module.exports = {
  supportsGetUserMedia,
  supportsWebSockets
}
