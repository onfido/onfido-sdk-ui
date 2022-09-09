import { Logger } from '../Logger'
import { ConsoleService } from '../services/ConsoleService'

describe('Logger', () => {
  // Services
  it('create logger with error', () => {
    // @ts-ignore
    expect(() => new Logger()).toThrow(
      'There are no services provided to the logger'
    )
  })

  it('create logger succefully', () => {
    const logger = new Logger({
      services: {
        log: new ConsoleService(),
      },
    })

    expect(logger).toBeInstanceOf(Logger)
  })
})
