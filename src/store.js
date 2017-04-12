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
    for (const name in this._store) {
      const obj = this._store[name];
      func(name, obj);
    }
  }
}

export default Store;
