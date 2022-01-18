/**
 * Calls a function passed with a specified delay, allows to cancel using the
 * return function.
 * @param fn Function that is invoked after each delay.
 */
export const poller: PollerFunc = (fn) => {
  let timeout: ReturnType<typeof setTimeout> | null = null
  let isCancelled = false

  const poll: PollFunc = (delay) => {
    if (timeout) clearTimeout(timeout)

    timeout = setTimeout(() => {
      if (isCancelled) return
      fn(poll)
    }, delay)
  }

  const cancel: CancelFunc = () => {
    if (isCancelled) return

    if (timeout) clearTimeout(timeout)

    timeout = null
    isCancelled = true
  }

  fn(poll)

  return cancel
}

export type PollerFunc = (fn: (poll: PollFunc) => void) => CancelFunc

export type PollFunc = (delay: number) => void
export type CancelFunc = () => void
