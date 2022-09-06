##### **_Owner: SDK Infrastructure_**

# Network

## Goal

- Provide easy api interface to send http requests
- Provide a central point to were all http requests are send through
- Provide middleware option to easily modify or monitor http requests
- Provide error handlers to capture errors across http requests easily

### Services:

- None

## Setup

```ts
import { Network, HttpRequestParams } from '~modules/Network'

const network = new Network({
  onMiddlewareError: (error: Error, httpRequestParams: HttpRequestParams) => void
  onRequestErrorResponse: (request: XMLHttpRequest, httpRequestParams: HttpRequestParams) => void
  middleware: [
    (httpRequestParams: HttpRequestParams) => HttpRequestParams | void
  ]
})
```

## API

### performHttpRequest

Create and send http request to an endpoint

```ts
network.performHttpRequest(
   httpRequestParams: {
    method?: 'GET' | 'POST' | 'PATCH'
    contentType?: string
    endpoint: string
    headers?: Record<string, string>
    payload?: string | FormData
    token?: string
   },
  onSuccess: SuccessCallback<T>,
  onError: (error: ApiRawError) => void
)
```

## Wishlist:

- Add support for promises
- Add posibility to abort a request mid flight (`request.abort`)
- Add support for custom timeout
- Add support for retries on timeout
- Provide consistent api for performHttpRequest (especially for onSuccess)
- Add versioning

## Changelog

### 0.0.0 - 5-6-2022

- Module created while maintining legacy api
