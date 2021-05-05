import { io, Socket, ManagerOptions } from 'socket.io-client'

const socketData: Partial<ManagerOptions> = {
  path: '/v4/socket.io', // default: /socket.io/ (previously was set to /v2/socket.io in SDK code base)
  upgrade: false, // default: true
  autoConnect: false,
  transports: ['websocket', 'polling'], // default: ['polling', 'websocket']
}

export const createSocket = (url?: string): Socket => {
  if (!url) {
    throw new Error('sync_url not provided')
  }

  return io(url, socketData)
}
