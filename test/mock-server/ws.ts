import {
  RouterContext,
  acceptWebSocket,
  acceptable,
  // isWebSocketCloseEvent,
} from './deps.ts'

import type { WebSocket } from './deps.ts'

export const handleSocketRequest = async (ctx: RouterContext) => {
  if (acceptable(ctx.request.serverRequest)) {
    const {
      conn,
      r: bufReader,
      w: bufWriter,
      headers,
    } = ctx.request.serverRequest

    const socket = await acceptWebSocket({
      conn,
      bufReader,
      bufWriter,
      headers,
    })

    handleShocket(socket)
  } else {
    throw new Error('Error when connecting websocket')
  }
}

export const handleShocket = async (ws: WebSocket): Promise<void> => {
  console.log('ws:', ws)
  // await broadcast(`> User with the id userId is connected`)

  // Wait for new messages
  /* for await (const event of ws) {
    const message = typeof event === 'string' ? event : ''

    await broadcast(message, userId)

    // Unregister user conection
    if (!message && isWebSocketCloseEvent(event)) {
      users.delete(userId)
      await broadcast(`> User with the id ${userId} is disconnected`)
    }
  } */
}
