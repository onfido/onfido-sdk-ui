import io from 'socket.io-client'

const socketData =  {
      path: "/v2/socket.io",
      upgrade: false, // default: true
      autoConnect: false,
      transports: ['websocket', 'polling'] // default: ['polling', 'websocket']
}

export const createSocket = (urls) => {
  const sync_url = `${urls.sync_v1_url}`
  return io(sync_url, socketData)
}
