import { Middleware, Router, send } from './deps.ts'

export const loggerMiddleware: Middleware = async (context, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start

  // Serve API requests
  console.group('\n----------')
  console.log(
    `[REQUEST] ${context.request.method} ${context.request.url} - ${ms}ms`,
    `Pathname: ${context.request.url.pathname}`
  )
  console.log(
    `[RESPONSE] ${context.response.status} ${JSON.stringify(
      context.response.body,
      null,
      2
    )}`
  )
  console.groupEnd()
}

export const frontendMiddleware: Middleware = async (context) => {
  const pathname: string = context.request.url.pathname

  const baseDir: string = pathname.match(/^\/local\//)
    ? Deno.cwd()
    : `${Deno.cwd()}/frontend`

  // Serve Preact app
  await send(context, pathname, {
    root: baseDir,
    index: 'index.html',
  })
}
