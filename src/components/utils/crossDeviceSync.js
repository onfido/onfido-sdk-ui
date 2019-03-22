import io from 'socket.io-client'

const supportsWebSockets = 'WebSocket' in window || 'MozWebSocket' in window

const defaultSocketData = { autoConnect: false }

const socketData = supportsWebSockets ? {
      path: "/v2/socket.io",
      upgrade: false, // default: true
      transports: ['websocket'] // default: ['polling', 'websocket']
  } : defaultSocketData

export const createSocket = () => io(process.env.DESKTOP_SYNC_URL, socketData)
