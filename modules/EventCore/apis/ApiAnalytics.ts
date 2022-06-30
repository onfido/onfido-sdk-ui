// @ts-nocheck
import { ApiInterface } from '../interfaces/ApiInterface'

export class ApiAnalytics extends ApiInterface {
  public middleware = (data) => ({
    ...data,
    timestamp: new Date().toISOString(),
  })

  public send(message) {
    this.dispatch(message)
  }
}
