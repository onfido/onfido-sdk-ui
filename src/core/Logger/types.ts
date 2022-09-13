export type EnvironmentType = 'production' | 'development' | 'test'
// export type LogLevels = 'info'
export type LogLevels = 'debug' | 'info' | 'warning' | 'error' | 'fatal'

export type LogData = {
  level: LogLevels
  labels: string[]
  message: string
  metadata?: Record<string, unknown>
  timestamp: string
  // Injected at build time (excluding hot reload)
  file?: string
  method?: string
  line?: string
}

export interface OutputInterface {
  write: (data: LogData, environment?: EnvironmentType) => void
}
