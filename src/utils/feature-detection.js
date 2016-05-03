export const supportsGetUserMedia = ('getUserMedia' in navigator || 'webkitGetUserMedia' in navigator || 'mozGetUserMedia' in navigator || 'msGetUserMedia' in navigator);

export const supportsWebSockets = 'WebSocket' in window;
