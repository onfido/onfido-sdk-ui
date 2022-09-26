import { describe, expect, it } from '@jest/globals'
import { poller } from '../poller'

describe('poller', () => {
  it('should poll after the specified delay', () => {
    const start = Date.now()
    const delay = 100
    let count = 0

    poller((poll) => {
      if (count < 3) {
        count++
        poll(100)
        return
      }

      const duration = Date.now() - start
      expect(duration).toBeGreaterThan(count * delay)
      expect(count).toBeLessThan(3)
    })
  })

  it('should allow to cancel the polling', () => {
    const delay = 100
    const maxCount = 5
    let count = 0

    const cancel = poller((poll) => {
      if (++count === maxCount) cancel()
      poll(delay)
    })

    setTimeout(() => {
      expect(count).toEqual(5)
    }, delay * (maxCount + 2))
  })

  it('should poll once if cancelled immediately', () => {
    const delay = 100
    let count = 0

    const cancel = poller((poll) => {
      count++
      poll(delay)
    })

    cancel()

    setTimeout(() => {
      expect(count).toEqual(1)
    }, delay + 2)
  })
})
