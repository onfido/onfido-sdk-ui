import type {
  LogData,
  EnvironmentType,
  OutputInterface,
  LogLevels,
} from '../types'

type Filter = {
  labels?: string
  levels?: LogLevels[]
}

export class ConsoleOutput implements OutputInterface {
  // Only for non-production
  private filters: Filter[] = []

  constructor(props?: { filters?: Filter[] }) {
    this.filters = props?.filters || this.filters
  }

  private applyFilters(data: LogData) {
    if (this.filters.length === 0) {
      return true
    }

    for (let i = 0; i < this.filters.length; i++) {
      const filter = this.filters[i]

      const matchLevels = filter.levels
        ? filter.levels?.indexOf(data.level) !== -1
        : true

      const matchLabels = filter.labels
        ? data.labels
            ?.join('.')
            // Allow * to be a wildcard and match any label(s)
            .match(new RegExp(`^${filter.labels.replace(/\*/g, '.+')}$`))
        : true

      if (matchLevels && matchLabels) {
        return true
      }
    }
    return false
  }

  private log(data: LogData) {
    const labels = data.labels.join('.')
    const timestamp = data.timestamp.split('T')[1]
    const origin = data?.file && `/${data.file}:${data.line}`

    const log = [
      `${timestamp} | [${labels}] | ${data.level} - ${data.message}`,
      data.metadata,
      origin,
    ].filter(Boolean)

    console.log(...log)
  }

  public write(data: LogData, environment?: EnvironmentType) {
    // for development, test
    if (environment !== 'production') {
      if (this.applyFilters(data)) {
        this.log(data)
      }
      return
    }

    // Only show message in production to prevent information from leaking
    if (environment === 'production' && data.level === 'fatal') {
      // @ts-ignore
      this.log({ message: data.message })
    }
  }
}
