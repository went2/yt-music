import EventBus from './event-bus';
import { isObject } from '../../utils/objhelper';

class EventStore {
  public actions: any
  public state: any
  public event: EventBus
  public eventV2: EventBus

  constructor(options: any) {
    if (!isObject(options.state)) {
      throw new TypeError("the state must be object type")
    }
    if (options.actions && isObject(options.actions)) {
      const values = Object.values(options.actions)
      for (const value of values) {
        if (typeof value !== "function") {
          throw new TypeError("the value of actions must be a function")
        }
      }
      this.actions = options.actions
    }
    this.state = options.state
    this._observe(options.state)
    this.event = new EventBus()
    this.eventV2 = new EventBus()
  }

  private _observe(state:any) {
    const _this = this
    Object.keys(state).forEach(key => {
      let _value = state[key]
      Object.defineProperty(state, key, {
        get: function() {
          return _value
        },
        set: function(newValue) {
          if (_value === newValue) return
          _value = newValue
          _this.event.emit(key, _value)
          _this.eventV2.emit(key, { [key]: _value })
        }
      })
    })
  }

  onState(stateKey:any, stateCallback: (param?: any)=>void) {
    const keys = Object.keys(this.state)
    if (keys.indexOf(stateKey) === -1) {
      throw new Error("the state does not contain your key")
    }
    this.event.on(stateKey, stateCallback)

    // callback
    if (typeof stateCallback !== "function") {
      throw new TypeError("the event callback must be function type")
    }
    const value = this.state[stateKey]
    //@ts-ignore
    stateCallback.apply(this.state, [value])
  }

  onStates(statekeys:any, stateCallback: (param?: any)=>void) {
    const keys = Object.keys(this.state)
    const value = {}
    for (const theKey of statekeys) {
      if (keys.indexOf(theKey) === -1) {
        throw new Error("the state does not contain your key")
      }
      this.eventV2.on(theKey, stateCallback)
      //@ts-ignore
      value[theKey] = this.state[theKey]
    }

    //@ts-ignore
    stateCallback.apply(this.state, [value])
  }

  offStates(stateKeys:any, stateCallback: (param?: any)=>void) {
    const keys = Object.keys(this.state)
    stateKeys.forEach((theKey:any) => {
      if (keys.indexOf(theKey) === -1) {
        throw new Error("the state does not contain your key")
      }
      this.eventV2.off(theKey, stateCallback)
    })
  }

  offState(stateKey:any, stateCallback: (param: any)=>void) {
    const keys = Object.keys(this.state)
    if (keys.indexOf(stateKey) === -1) {
      throw new Error("the state does not contain your key")
    }
    this.event.off(stateKey, stateCallback)
  }

  setState(stateKey:any, stateValue:any) {
    this.state[stateKey] = stateValue
  }

  dispatch(actionName: string, ...args: any[]) {
    if (typeof actionName !== "string") {
      throw new TypeError("the action name must be string type")
    }
    if (Object.keys(this.actions).indexOf(actionName) === -1) {
      throw new Error("this action name does not exist, please check it")
    }
    const actionFn = this.actions[actionName]
    actionFn.apply(this, [this.state, ...args])
  }
}

export default EventStore;