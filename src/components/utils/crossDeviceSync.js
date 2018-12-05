import io from 'socket.io-client'

export const socketIoConfig = () =>
  io(process.env.DESKTOP_SYNC_URL, {
      path: "/v2/socket.io",
      autoConnect: false,
      upgrade: false, // default: true
      transports: ['websocket'], // default: ['polling', 'websocket']
  })
