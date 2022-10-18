class EventBus {
  private eventBus: any
  constructor() {
    this.eventBus = {}
  }

  on(eventName: string, eventCallback: (param?:any)=>void, thisArg?: any) {
    if (typeof eventName !== "string") {
      throw new TypeError("the event name must be string type")
    }

    if (typeof eventCallback !== "function") {
      throw new TypeError("the event callback must be function type")
    }

    let hanlders = this.eventBus[eventName];
    if (!hanlders) {
      hanlders = []
      this.eventBus[eventName] = hanlders
    }

    hanlders.push({
      eventCallback,
      thisArg
    })
    return this;
  }

  once(eventName: string, eventCallback: (param?:any)=>void, thisArg: any) {
    if (typeof eventName !== "string") {
      throw new TypeError("the event name must be string type")
    }

    if (typeof eventCallback !== "function") {
      throw new TypeError("the event callback must be function type")
    }
    
    const tempCallback = (...payload: any[]) => {
      this.off(eventName, tempCallback)
      eventCallback.apply(thisArg, payload as [])
    }
    
    return this.on(eventName, tempCallback, thisArg)
  }

  emit(eventName: string, ...payload: any[]) {
    if (typeof eventName !== "string") {
      throw new TypeError("the event name must be string type")
    }

    const handlers = this.eventBus[eventName] || []
    handlers.forEach((handler:any) => {
      handler.eventCallback.apply(handler.thisArg, payload)
    })
    return this
  }

  off(eventName: string, eventCallback: (param?: any)=>void) {
    if (typeof eventName !== "string") {
      throw new TypeError("the event name must be string type")
    }

    if (typeof eventCallback !== "function") {
      throw new TypeError("the event callback must be function type")
    }

    const handlers = this.eventBus[eventName]
    if (handlers && eventCallback) {
      const newHandlers = [...handlers]
      for (let i = 0; i < newHandlers.length; i++) {
        const handler = newHandlers[i]
        if (handler.eventCallback === eventCallback) {
          const index = handlers.indexOf(handler)
          handlers.splice(index, 1)
        }
      }
    }

    if (handlers.length === 0) {
      delete this.eventBus[eventName]
    }
  }
}

export default EventBus