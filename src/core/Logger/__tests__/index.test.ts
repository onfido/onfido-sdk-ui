import { Logger } from '../Logger'
import { ConsoleOutput } from '../outputs/ConsoleOutput'

describe('Logger', () => {
  // Services
  it('create logger with error', () => {
    // @ts-ignore
    expect(() => new Logger()).toThrow(
      'There are no outputs provided to the logger'
    )
  })

  it('create logger succefully', () => {
    const logger = new Logger({
      outputs: [new ConsoleOutput()],
    })

    expect(logger).toBeInstanceOf(Logger)
  })
})
