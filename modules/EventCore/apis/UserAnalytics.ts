// @ts-nocheck
import { ApiInterface } from "../interfaces/ApiInterface"

export class UserAnalytics extends ApiInterface {
  public send(message){
    this.dispatch(message)
  }
}