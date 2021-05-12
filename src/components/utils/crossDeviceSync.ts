import io from 'socket.io-client'

const socketData: SocketIOClient.ConnectOpts = {
  path: '/v3/socket.io',
  upgrade: false, // default: true
  autoConnect: false,
  transports: ['websocket', 'polling'], // default: ['polling', 'websocket']
}

export const createSocket = (url?: string): SocketIOClient.Socket => {
  if (!url) {
    throw new Error('sync_url not provided')
  }

  return io(url, socketData)
}
