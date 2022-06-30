// @ts-nocheck
export class ServiceInterface {
  private outputs = []
  protected configuration

  constructor({ outputs, configuration }) {
    this.outputs = outputs
    this.configuration = configuration
  }

  dispatch(data) {
    ;(this.outputs || []).forEach((output) => output?.dispatch(data))
  }
}
