// @ts-nocheck
import { ApiInterface } from "../interfaces/ApiInterface"

export class Logger extends ApiInterface {
  public send(message){
    this.dispatch(message)
  }
}