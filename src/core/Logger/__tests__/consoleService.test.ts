import { Logger } from '../Logger'
import { ConsoleService } from '../services/ConsoleService'

describe('Logger - with ConsoleService', () => {
  it('create', () => {
    const consoleService = new ConsoleService()
    expect(consoleService).toBeInstanceOf(ConsoleService)
  })

  describe('in production', () => {
    const logger = new Logger({
      services: {
        log: new ConsoleService({ environment: 'production' }),
      },
    })

    const logInstance = logger.createInstance('default')

    it('debug', () => {
      console.log = jest.fn()
      logInstance.debug('hi')
      expect(console.log).toBeCalledTimes(0)
    })
    it('info', () => {
      console.log = jest.fn()
      logInstance.info('hi')
      expect(console.log).toBeCalledTimes(0)
    })
    it('warning', () => {
      console.log = jest.fn()
      logInstance.warning('hi')
      expect(console.log).toBeCalledTimes(0)
    })
    it('error', () => {
      console.log = jest.fn()
      logInstance.error('hi')
      expect(console.log).toBeCalledTimes(0)
    })
    it('fatal', () => {
      console.log = jest.fn()
      logInstance.fatal('hi')
      expect(console.log).toBeCalledTimes(1)
    })
  })

  describe('in development', () => {
    const logger = new Logger({
      services: {
        log: new ConsoleService({ environment: 'development' }),
      },
    })

    const logInstance = logger.createInstance('default')

    it('debug', () => {
      console.log = jest.fn()
      logInstance.debug('hi')
      expect(console.log).toBeCalledTimes(1)
    })
    it('info', () => {
      console.log = jest.fn()
      logInstance.info('hi')
      expect(console.log).toBeCalledTimes(1)
    })
    it('warning', () => {
      console.log = jest.fn()
      logInstance.warning('hi')
      expect(console.log).toBeCalledTimes(1)
    })
    it('error', () => {
      console.log = jest.fn()
      logInstance.error('hi')
      expect(console.log).toBeCalledTimes(1)
    })
    it('fatal', () => {
      console.log = jest.fn()
      logInstance.fatal('hi')
      expect(console.log).toBeCalledTimes(1)
    })
  })
})
