import { ServiceInterface } from '../interfaces/ServiceInterface'

export class InhouseService extends ServiceInterface {
  dispatch(data: any): void {
    super.dispatch({
      ...data,
      url: 'http://inhouse',
      config: this.configuration.getState(),
    })
  }
}
