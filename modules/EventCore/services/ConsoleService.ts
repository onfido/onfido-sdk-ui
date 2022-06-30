import { ServiceInterface } from "../interfaces/ServiceInterface";

export class ConsoleService extends ServiceInterface {
  dispatch(data: any): void {
    console.log('[Console Service]', data)
  }
}