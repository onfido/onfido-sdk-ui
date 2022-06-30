// @ts-nocheck
import { ApiInterface } from "../interfaces/ApiInterface"

export class ExceptionHandler extends ApiInterface {
  public send(message){
    this.dispatch(message)
  }
}