import io from 'socket.io-client'

const socketData: SocketIOClient.ConnectOpts = {
  path: '/socket.io',
}

export const createSocket = (url?: string): SocketIOClient.Socket => {
  if (!url) {
    throw new Error('sync_url not provided')
  }

  return io(url, socketData)
}
