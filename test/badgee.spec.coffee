chai   = require 'chai'
sinon  = require 'sinon'
badgee = require '../build/badgee.js'

expect = chai.expect

defaultConf =
  enabled: yes
  styled:  yes

describe 'badgee', ->

  it 'should be defined', ->
    expect(badgee).not.to.equal undefined

  describe 'badgee.config', ->

    it 'should be a function', ->
      expect(badgee).itself.to.respondTo 'config'

    it 'should return default config object', ->
      conf = badgee.config()
      expect(conf).to.be.an 'object'
      expect(conf).to.have.property 'enabled', defaultConf.enabled
      expect(conf).to.have.property 'styled', defaultConf.styled

    it 'should allow to define config', ->
      badgee.config
        enabled: no
        styled:  no
      conf = badgee.config()
      expect(conf).to.have.property 'enabled', no
      expect(conf).to.have.property 'styled', no

    after ->
      badgee.config defaultConf

  describe 'badgee.style', ->

    it 'should be a function', ->
      expect(badgee).itself.to.respondTo 'style'

    it 'should return the available styles', ->
      styles = badgee.style()
      expect(styles).to.be.an 'array'
      expect(styles).to.have.length.of.at.least(5)

    it 'should allow to define a new style', ->
      badgee.style('test', {color:'white',background:'red'})
      expect(badgee.style()).to.include 'test'



  badge1 =
    label   : 'badge1'
    style   : 'green',
    cName   : "%cbadge1"
    cSytle  : "border-radius:2px;padding:1px 3px;margin:0 1px;color:white;background:green;"
    instance: null

  badge2 =
    label   : 'badge2'
    style   : 'test',
    cName   : "%cbadge2"
    cSytle  : "color:white;background:red;"
    instance: null

  describe 'badgee.define', ->

    it 'should be a function', ->
      expect(badgee).to.respondTo 'define'

    it 'should return another badgee', ->
      badge1.instance = badgee.define badge1.label, badge1.style
      expect(badge1.instance).to.be.an 'object'
      expect(badge1.instance).to.respondTo 'define'
      badge2.instance = badge1.instance.define badge2.label, badge2.style
      expect(badge2.instance).to.be.an 'object'

  describe 'badgee.get', ->

    it 'should be a function', ->
      expect(badgee).to.respondTo 'get'

    it 'should return an existing badgee', ->
      b = badgee.get badge1.label
      expect(b).to.equal badge1.instance

  describe 'console API:', ->
    # methods = ['log']
    methods = [
      'debug', 'dirxml', 'error', 'group',
      'groupCollapsed', 'info', 'log', 'warn'
    ]
    unformatableMethods = [
      'assert', 'clear', 'count', 'dir', 'exception', 'groupEnd', 'markTimeline', 'profile',
      'profileEnd', 'table', 'trace', 'time', 'timeEnd', 'timeStamp', 'timeline',
      'timelineEnd'
    ]

    spyConsoleCallWithArgs = (badgeeInstance, conf, method, args, closure) ->

      sinon.spy(console, method)
      # the config method redefines console bindings
      # We need to call it here for the spy to be called
      badgee.config.call badgee, conf

      # this one makes test output really messy,
      # but the test is OK so...
      badgeeInstance[method] args...

      closure()
      # restore the original console method
      console[method].restore()
      badgee.config defaultConf
      return

    for method in methods
      do (method) ->

        describe method, ->

          it "badgee.#{method} should be function", ->
            expect(badgee).to.respondTo method

          it "badge1.#{method} should be function", ->
            expect(badge1.instance).to.respondTo method

          it "badge2.#{method} should be a function", ->
            expect(badge2.instance).to.respondTo method

          it "badgee.#{method} should call console.#{method} with the exact same parameters", ->
            args = ['hello', 1234, {key1: 'value', key2: 0}, true]

            spyConsoleCallWithArgs badgee, defaultConf, method, args, ->
              expect(console[method].called).to.be.true
              expect(console[method].calledWithExactly args...).to.be.true

          it "badge1.#{method} should call console.#{method} with extra parameters", ->
              args = ['hello', 1234, {key1: 'value', key2: 0}, true]

              spyConsoleCallWithArgs badge1.instance, defaultConf, method, args, ->
                expect(console[method].calledOnce).to.be.true
                expect(console[method].calledWithExactly "#{badge1.cName}%c", badge1.cSytle, 'p:a', args...).to.be.true

          it "badge2.#{method} should call console.#{method} with extra parameters", ->
              args = ['hello', 1234, {key1: 'value', key2: 0}, true]

              spyConsoleCallWithArgs badge2.instance, defaultConf, method, args, ->
                expect(console[method].calledOnce).to.be.true
                expect(console[method].calledWithExactly "#{[badge1.cName,badge2.cName].join('')}%c", badge1.cSytle, badge2.cSytle, 'p:a', args...).to.be.true

          it "badgee.#{method} shouldn't call console when disabled", ->
            args = ['hello', 1234, {key1: 'value', key2: 0}, true]

            conf = enabled: no
            spyConsoleCallWithArgs badgee, conf, method, args, ->
              expect(console[method].called).to.be.false

          it "badge1.#{method} shouldn't call console when disabled", ->
            args = ['hello', 1234, {key1: 'value', key2: 0}, true]

            conf = enabled: no
            spyConsoleCallWithArgs badge1.instance, conf, method, args, ->
              expect(console[method].called).to.be.false

          it "badge2.#{method} shouldn't call console when disabled", ->
            args = ['hello', 1234, {key1: 'value', key2: 0}, true]

            conf = enabled: no
            spyConsoleCallWithArgs badge2.instance, conf, method, args, ->
              expect(console[method].called).to.be.false


