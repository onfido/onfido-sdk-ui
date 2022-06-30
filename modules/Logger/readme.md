##### **_Owner: SDK Infrastructure_**

# Logger

## Goal

- Provide an interface to capture logs
- Provide an service to send the captured logs to the console
- Future: Provide a service to send captured logs to our backend
- Future: Allow logger to be configured remotely

### Services:

- None

## Setup

```ts
import { Logger } from '~modules/Logger'

// Available services
import { ConsoleService } from '~modules/Logger/services/ConsoleService'

// Create central logger
const mainLogger = new Logger({
  services: [new ConsoleService()],
})

// Create an instance with a custom label
const faceVideoLogger = mainLogger.createInstance('facevideo')
faceVideoLogger.info('Hello!')
```

## API

### createInstance

Create a new logger instance with a label

```tsx
const instanceLogger = mainLogger.createInstance(label: string)
```

##### Log levels:

- debug
- info
- warning
- error
- fatal

```ts
instanceLogger.debug(message: string, metadata?: Record<string, unknown>)
instanceLogger.info(message: string, metadata?: Record<string, unknown>)
instanceLogger.warning(message: string, metadata?: Record<string, unknown>)
instanceLogger.error(message: string, metadata?: Record<string, unknown>)
instanceLogger.fatal(message: string, metadata?: Record<string, unknown>)
```

## Services

### Api

```ts
import type { ServiceInterface } from '~modules/Logger'

type DataPackage = {
  label: string
  level: LabelKeyType
  message: string
  metadata?: Record<string, unknown>
  filePath?: string
  methodName?: string
  lineNumber?: string
}

class CustomService implements ServiceInterface {
  public dispatch(data: DataPackage) {
    // Your implementation .....
    return true
  }
}
```

### ConsoleService

An optional provided service to output logs to the console

```ts
import { ConsoleService } from '~modules/Logger/services/ConsoleService'

// Create central logger
const mainLogger = new Logger({
  services: [
    new ConsoleService({
      environment: string, // production / development
    }),
  ],
})
```

#### Environments

##### Development

All log levels are outputted to the console

##### Production

Only the `fatal` log level is outputted to the console

## Wishlist

- Add inhouse analytics service
- Configurable remotely by SDK configuration service

## Changelog

### 0.0.0 - 5-6-2022

- Module created
