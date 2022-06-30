import { ServiceInterface } from "../interfaces/ServiceInterface";

export class IntegratorAnalyticsService extends ServiceInterface {
  dispatch(data: any): void {
    console.log('[Integator Analytics]', data)
  }
}