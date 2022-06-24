// @ts-nocheck
type TAnalyticsServiceProps = {
  network: unknown
  options: {
    url: string
  }
}

export class AnalyticsService {
  network = undefined
  options = {
    url: 'http://default',
  }

  constructor(props: TAnalyticsServiceProps) {
    this.network = props.network
  }

  dispatchToNetwork = (data) => {
    this.network.dispatch({
      url: this.options.url,
      data,
    })
  }
}