import { Application, oakCors } from './deps.ts'

import { frontendMiddleware, loggerMiddleware } from './middlewares.ts'
import {
  mockRouter,
  apiRouter,
  telephonyRouter,
  tokenFactoryRouter,
} from './routers.ts'

const app = new Application()

app.use(loggerMiddleware)
app.use(oakCors())

/* Back-end routes */

app.use(mockRouter.routes())
app.use(mockRouter.allowedMethods())
app.use(apiRouter.routes())
app.use(apiRouter.allowedMethods())
app.use(tokenFactoryRouter.routes())
app.use(tokenFactoryRouter.allowedMethods())
app.use(telephonyRouter.routes())
app.use(telephonyRouter.allowedMethods())
/* Front-end routes */

app.use(frontendMiddleware)

app.listen({
  port: 8081,
  secure: false,
})

await app.listen({
  certFile: 'cert.pem',
  keyFile: 'key.pem',
  port: 8082,
  secure: true,
})
