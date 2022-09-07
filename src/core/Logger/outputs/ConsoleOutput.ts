import type {
  LogData,
  EnvironmentType,
  OutputInterface,
  LogLevels,
} from '../types'

type Filter = {
  label?: string
  levels?: LogLevels[]
}

export class ConsoleOutput implements OutputInterface {
  // Only for non-production
  private filters: Filter[] = []

  constructor(props?: { filters?: Filter[] }) {
    this.filters = props?.filters || this.filters
  }

  public write(data: LogData, environment: EnvironmentType) {
    // for development, test
    if (environment !== 'production') {
      if (this.applyFilters(data)) {
        this.log(data)
      }
      return true
    }

    // Only show message in production to prevent information from leaking
    if (environment === 'production' && data.level === 'fatal') {
      this.log({ message: data.message })
    }

    return false
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

      const matchLabels = filter.label
        ? data.labels
            ?.join('.')
            // Allow * to be a wildcard and match any label(s)
            .match(new RegExp(`^${filter.label.replace(/\*/g, '.+')}$`))
        : true

      if (matchLevels && matchLabels) {
        return true
      }
    }
    return false
  }

  private log(data: { message: string } | LogData) {
    console.log('[console]', data)
    // let log: unknown[] = [
    //   `[${data.labels.join(',')}:${data.level}] ${data.message}`,
    // ]

    // if (environment !== 'production') {
    //   log = log.concat([
    //     data.metadata,
    //     { line: data.line, file: data.file, method: data.method },
    //   ])
    // }

    // console.log(...log)
  }
}
