// @ts-nocheck
export class Network {
  private middleware = []

  constructor({ middleware }) {
    this.middleware = middleware
  }

  public dispatch = (data) => {
    let modifiedData = data

    ;(this.middleware || []).map((item) => {
      if (item) {
        modifiedData = item.middleware(modifiedData)
      }
    })

    this.performNetworkRequest(modifiedData)
  }

  private performNetworkRequest = (data) => {
    console.log('[Network Request]', data)
  }

  public setMiddleware = (middlware) => {
    this.middleware = middlware
  }

  public addMiddlware = (middleware) => {
    this.middleware.push(middleware)
  }
}
