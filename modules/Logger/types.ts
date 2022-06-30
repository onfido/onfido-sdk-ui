export type EnviromentType = 'production' | 'development' | 'debug'
export type LabelKeyType = 'debug' | 'info' | 'warning' | 'error' | 'fatal'

export type DataPackage = {
  label: string
  level: LabelKeyType
  message: string
  metadata?: Record<string, unknown>

  // Injected at build time (excluding hot reload)
  filePath?: string
  methodName?: string
  lineNumber?: string
}

export type ServicesType = Record<string, ServiceInterface>
export interface ServiceInterface {
  dispatch: (data: DataPackage) => boolean
}
