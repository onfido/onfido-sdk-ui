import { Logger } from '../Logger'
import { ConsoleOutput } from '../outputs/ConsoleOutput'

describe('Logger - with ConsoleOutput', () => {
  it('create', () => {
    const consoleOutput = new ConsoleOutput()
    expect(consoleOutput).toBeInstanceOf(ConsoleOutput)
  })

  describe('in production', () => {
    const logger = new Logger({
      environment: 'production',
      outputs: [new ConsoleOutput()],
    })

    it('debug', () => {
      console.log = jest.fn()
      logger.debug('hi')
      expect(console.log).toBeCalledTimes(0)
    })
    it('info', () => {
      console.log = jest.fn()
      logger.info('hi')
      expect(console.log).toBeCalledTimes(0)
    })
    it('warning', () => {
      console.log = jest.fn()
      logger.warning('hi')
      expect(console.log).toBeCalledTimes(0)
    })
    it('error', () => {
      console.log = jest.fn()
      logger.error('hi')
      expect(console.log).toBeCalledTimes(0)
    })
    it('fatal', () => {
      console.log = jest.fn()
      logger.fatal('hi')
      expect(console.log).toBeCalledTimes(1)
    })
  })

  describe('in development', () => {
    const logger = new Logger({
      environment: 'development',
      outputs: [new ConsoleOutput()],
    })

    it('debug', () => {
      console.log = jest.fn()
      logger.debug('hi')
      expect(console.log).toBeCalledTimes(1)
    })
    it('info', () => {
      console.log = jest.fn()
      logger.info('hi')
      expect(console.log).toBeCalledTimes(1)
    })
    it('warning', () => {
      console.log = jest.fn()
      logger.warning('hi')
      expect(console.log).toBeCalledTimes(1)
    })
    it('error', () => {
      console.log = jest.fn()
      logger.error('hi')
      expect(console.log).toBeCalledTimes(1)
    })
    it('fatal', () => {
      console.log = jest.fn()
      logger.fatal('hi')
      expect(console.log).toBeCalledTimes(1)
    })
  })
})
