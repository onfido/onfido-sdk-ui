/*
  Responsibilities:
    - Provide public api
    - Send logs to centeral place
*/
import type { Logger } from './Logger'
import type { LabelKeyType } from './types'

export class LogInstance {
  private labels: string[]
  private dispatch: Logger['dispatch']

  constructor(labels: string | string[], dispatch: Logger['dispatch']) {
    this.labels = typeof labels === 'string' ? [labels] : labels
    this.dispatch = dispatch
  }

  // Note: file, method, line are injected at build time
  private capture = (level: LabelKeyType) => (
    message: string,
    metadata?: Record<string, unknown>,
    file?: string,
    method?: string,
    line?: string
  ) => {
    this.dispatch({
      labels: this.labels,
      level,
      message,
      metadata,
      file,
      method,
      line,
    })
  }

  public debug = this.capture('debug')
  public info = this.capture('info')
  public warning = this.capture('warning')
  public error = this.capture('error')
  public fatal = this.capture('fatal')
}
