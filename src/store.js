import { each } from './utils.js'

class Store {
  constructor() {
    this._store = {};
  }

  // Add object to store
  add(name, obj) {
    this._store[name] = obj;
  }

  // get obj from store
  get(name) {
    return this._store[name] || null
  }

  list() {
    return Object.keys(this._store);
  }

  each(func) {
    each(this._store, function(obj, name) {
      func(name, obj);
    })
  }
}

export default Store;
