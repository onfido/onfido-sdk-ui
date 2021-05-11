import { io, Socket } from 'socket.io-client'

// const socketData: Partial<ManagerOptions> = {
//   path: `/socket.io`,
//   upgrade: false, // default: true
//   autoConnect: false,
//   transports: ['websocket', 'polling'], // default: ['polling', 'websocket']
// }

export const createSocket = (url?: string, version?: string): Socket => {
  if (!url) {
    throw new Error('sync_url not provided')
  }
  const syncVersion = version === 'v1' ? '' : `/${version}`

  const socketData = {
    path: `${syncVersion}/socket.io`,
    upgrade: false, // default: true
    autoConnect: false,
    transports: version === 'v1' ? ['polling'] : ['websocket', 'polling'],
  }

  return io(url, socketData)
}
