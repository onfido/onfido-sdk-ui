type IAnalyticsCoreProps = {
  services: any[]
  interfaces: any[]
  network?: unknown
}

export class AnalyticsCore {
  queue = []
  services = {}
  interfaces = {}
  network = undefined

  constructor(props: IAnalyticsCoreProps) {
    this.services = props.services
    this.interfaces = props.interfaces
    this.network = props.network
  }
}
