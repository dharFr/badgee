
class Store
  constructor: ->
    @_store = {}

  # Add object to store
  add: (name, obj) ->
    @_store[name] = obj

  # get obj from store
  get: (name) ->
    if @_store[name] then @_store[name] else null

  list: () ->
    name for name, obj of @_store

  each: (func) ->
    func(name, obj) for name, obj of @_store

module.exports = Store
