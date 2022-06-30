import { ServiceInterface } from '../interfaces/ServiceInterface'

export class WoopraService extends ServiceInterface {
  dispatch(data: any): void {
    super.dispatch({
      ...data,
      url: 'http://woopra',
      config: this.configuration.getState(),
    })
  }
}
