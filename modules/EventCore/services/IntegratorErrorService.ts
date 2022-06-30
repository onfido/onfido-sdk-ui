import { ServiceInterface } from "../interfaces/ServiceInterface";

export class IntegratorErrorService extends ServiceInterface {
  dispatch(data: any): void {
    console.log('[Integator Error]', data)
  }
}