import io from 'socket.io-client'

const supportsWebSockets = 'WebSocket' in window || 'MozWebSocket' in window

const transports = supportsWebSockets ? ['websocket'] : ['polling']

export const createSocket = () =>
  io(process.env.DESKTOP_SYNC_URL, {
      path: "/v2/socket.io",
      autoConnect: false,
      upgrade: false, // default: true
      transports, // default: ['polling', 'websocket']
  })
