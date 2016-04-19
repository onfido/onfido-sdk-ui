const supportsGetUserMedia = ('getUserMedia' in navigator || 'webkitGetUserMedia' in navigator || 'mozGetUserMedia' in navigator || 'msGetUserMedia' in navigator)

module.exports = supportsGetUserMedia
