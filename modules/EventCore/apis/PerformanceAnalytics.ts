// @ts-nocheck
import { ApiInterface } from "../interfaces/ApiInterface"

export class PerformanceAnalytics extends ApiInterface {
  public send(message){
    this.dispatch(message)
  }
}