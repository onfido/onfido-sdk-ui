/* 
  Architectural flow:
  - Instances -> Central place -> Services (console, network)

  Responsibilities:
    - Be central place to collect all logs from instances and dispatch them to available services
    - Provide log instances
*/
import { EnvironmentType, LogData, OutputInterface } from './types'

export type LoggerProps = {
  labels?: string[]
  outputs: OutputInterface[]
  environment?: EnvironmentType
}

export type logMethodProps = [
  message: string,
  metadata: unknown,
  file?: string,
  method?: string,
  line?: string
]

export class Logger {
  private labels: string[] = []
  private environment: EnvironmentType =
    (process.env.NODE_ENV as EnvironmentType) || 'production'
  private outputs: OutputInterface[] = []

  constructor(props: LoggerProps) {
    this.labels = props?.labels || this.labels
    this.outputs = props?.outputs || this.outputs
    this.environment = props?.environment || this.environment

    if (!this.outputs.length) {
      throw new Error('There are no outputs provided to the logger')
    }
  }

  private log(data: LogData) {
    Object.values(this.outputs || {}).forEach((output: OutputInterface) => {
      if (output?.write) {
        output.write(data, this.environment)
      }
    })
  }

  // Allow to append new labels easily
  withLabels(labels: string[]) {
    return new Logger({
      labels: [...this.labels, ...labels],
      environment: this.environment,
      outputs: this.outputs,
    })
  }

  debug(
    message: string,
    metadata?: Record<string, unknown>,
    file?: string,
    method?: string,
    line?: string
  ) {
    this.log({
      level: 'debug',
      labels: this.labels,
      message,
      metadata,
      file,
      method,
      line,
    })
  }

  info(
    message: string,
    metadata?: Record<string, unknown>,
    file?: string,
    method?: string,
    line?: string
  ) {
    this.log({
      level: 'info',
      labels: this.labels,
      message,
      metadata,
      file,
      method,
      line,
    })
  }

  warning(
    message: string,
    metadata?: Record<string, unknown>,
    file?: string,
    method?: string,
    line?: string
  ) {
    this.log({
      level: 'warning',
      labels: this.labels,
      message,
      metadata,
      file,
      method,
      line,
    })
  }

  error(
    message: string,
    metadata?: Record<string, unknown>,
    file?: string,
    method?: string,
    line?: string
  ) {
    this.log({
      level: 'error',
      labels: this.labels,
      message,
      metadata,
      file,
      method,
      line,
    })
  }

  fatal(
    message: string,
    metadata?: Record<string, unknown>,
    file?: string,
    method?: string,
    line?: string
  ) {
    this.log({
      level: 'fatal',
      labels: this.labels,
      message,
      metadata,
      file,
      method,
      line,
    })
  }
}
