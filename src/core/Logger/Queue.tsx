// TODO: flush before closing webpage/sdk/oncomplete, how?
export class Queue<T> {
  private limit = 1 //20
  private queue: T[] = []
  private flushListener?: (data: T[]) => void = undefined
  private paused = false

  constructor(props?: {
    limit?: number
    paused: boolean
    flushListener: (data: T[]) => void
  }) {
    this.limit = props?.limit || this.limit
    this.paused = props?.paused || this.paused
    this.flushListener = props?.flushListener

    if (!this.flushListener) {
      throw new Error('The Queue does not have a listener')
    }
  }

  public push(data: T) {
    this.queue.push(data)

    if (this.queue.length >= this.limit) {
      this.flush()
    }
  }

  public flush() {
    if (this.paused || this.queue.length < this.limit) {
      return
    }

    // Note: splice removes first x items from the this.queue automatically
    const batch = this.queue.splice(0, this.limit)

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.flushListener!(batch)

    if (this.queue.length >= this.limit) {
      this.flush()
    }
  }

  public filter(filter: (data: T) => boolean) {
    this.queue = this.queue.filter(filter)
  }

  public pause() {
    this.paused = true
  }

  public resume() {
    if (!this.paused) {
      return
    }
    this.paused = false
    this.flush()
  }
}
