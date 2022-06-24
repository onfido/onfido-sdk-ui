// @ts-nocheck
export class Network {
  // Support batch
  queue = []
  options: {
    pipes: []
  }

  constructor(props) {
    this.options = props
  }

  dispatch = (data: Record<string, unknown>) => {
    ;(this.options?.pipes || []).forEach((method) => {
      data = method(data)
    })

    console.log('[Network] Sending data:', data)
  }
}
