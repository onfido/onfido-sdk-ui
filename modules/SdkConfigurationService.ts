// @ts-nocheck
export class SdkConfigurationService {
  private state = { id: 1 }

  constructor(defaultState){
    this.state = defaultState || this.state
  }

  getState = () => {
    this.state.id++
    return this.state
  }
}