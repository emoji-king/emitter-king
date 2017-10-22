class Deferred {
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.reject = reject
      this.resolve = resolve
    })
  }
}

export class EmitterKing {
  constructor(emitter) {
    this.emitter = emitter
    this.deferrals = []
    this.data = []
    this.ended = false
    this.errored = false
  }


  emit(event) {
    this.emitter.on(event, (...args) => {
      this.data.push(args)
      this.process()
    })
  }

  end(event, value) {
    this.emitter.on(event, (...args) => {
      this.ended = true
      this.endval = value
      this.process()
    })
  }

  error(event) {
    this.emitter.on(event, (...args) => {
      this.errored = true
      this.errorval = args
      this.process()
    })
  }

  async get() {
    const deferred = new Deferred()
    this.deferrals.push(deferred)
    this.process()
    return deferred.promise
  }

  process() {
    while (this.data.length > 0 && this.deferrals.length > 0) {
      this.deferrals.shift().resolve(...this.data.shift())
    }
    if (this.data.length > 0) {
      return
    }
    if (this.errored) {
      this.deferrals.splice(0).forEach((deferred) => { deferred.reject(this.errorval) })
    }
    if (this.ended) {
      this.deferrals.splice(0).forEach((deferred) => { deferred.resolve(this.endval) })
    }
  }
}
