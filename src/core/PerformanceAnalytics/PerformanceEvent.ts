export class PerformanceEvent<T> {
  public eventName: string
  public time: number = Date.now()
  private properties: T

  constructor(eventName: string, properties: T) {
    this.eventName = eventName
    this.properties = properties
  }

  public getProperties = () => this.properties
}
