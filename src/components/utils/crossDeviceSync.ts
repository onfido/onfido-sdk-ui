import { io, Socket, ManagerOptions } from 'socket.io-client'

const socketData: Partial<ManagerOptions> = {
  path: '/v3/socket.io', // default: 'socket.io' (NOTE: this path must match latest path version on cross_device_sync back end service)
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
