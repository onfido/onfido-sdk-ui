import io from 'socket.io-client'

const socketData =  {
      path: "/v2/socket.io",
      upgrade: false, // default: true
      autoConnect: false,
      transports: ['websocket', 'polling'] // default: ['polling', 'websocket']
}

export const createSocket = () => io(process.env.DESKTOP_SYNC_URL, socketData)
