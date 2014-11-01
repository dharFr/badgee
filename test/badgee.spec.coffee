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

    it 'should return a style definition', ->
      style = badgee.style('green')
      expect(style).to.be.an 'object'
      expect(style).to.have.property 'background', 'green'

    it 'should allow to define a new style', ->
      badgee.style('test', {color:'white',background:'red'})
      expect(badgee.style()).to.include 'test'

      testStyle = badgee.style('test')

      expect(testStyle).to.be.an 'object'
      expect(testStyle).to.have.property 'background', 'red'
      expect(testStyle).to.have.property 'color', 'white'

  describe 'badgee.defaultStyle', ->

    it 'should be a function', ->
      expect(badgee).itself.to.respondTo 'defaultStyle'

    it 'should return default properties for new styles', ->
      def = badgee.defaultStyle()

      expect(def).to.be.an 'object'
      expect(def).to.have.property 'border-radius', '2px'
      expect(def).to.have.property 'padding', '1px 3px'
      expect(def).to.have.property 'margin', '0 1px'
      expect(def).to.have.property 'color', 'white'

    it 'should be used when defining a new style', ->
      badgee.style('defTest', {color:'black',background:'red'})
      testStyle = badgee.style('defTest')

      expect(testStyle).to.be.an 'object'
      expect(testStyle).to.have.property 'border-radius', '2px'
      expect(testStyle).to.have.property 'padding', '1px 3px'
      expect(testStyle).to.have.property 'margin', '0 1px'
      expect(testStyle).to.have.property 'color', 'black'

    it 'should allow to define new default properties', ->

      # Save default style
      def = badgee.defaultStyle()

      badgee.defaultStyle(color:'red')
      def = badgee.defaultStyle()

      expect(def).to.be.an 'object'
      expect(def).not.to.have.property 'border-radius'
      expect(def).not.to.have.property 'padding'
      expect(def).not.to.have.property 'margin'
      expect(def).to.have.property 'color', 'red'

      # Restore default style
      badgee.defaultStyle def

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
    cSytle  : "border-radius:2px;padding:1px 3px;margin:0 1px;color:white;background:red;"
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

    _spyConsole = (conf, method) ->
      sinon.spy(console, method)
      # the config method redefines console bindings
      # We need to call it here for the spy to be called
      badgee.config.call badgee, conf

    _restoreConsole = (method) ->
      # restore the original console method
      console[method].restore()
      badgee.config defaultConf


    for method in methods
      do (method) ->

        describe method, ->

          describe 'when enabled', ->

            beforeEach ->
              _spyConsole defaultConf, method

            afterEach ->
              _restoreConsole method


            it "badgee.#{method} should be function", ->
              expect(badgee).to.respondTo method

            it "badge1.#{method} should be function", ->
              expect(badge1.instance).to.respondTo method

            it "badge2.#{method} should be a function", ->
              expect(badge2.instance).to.respondTo method

            it "badgee.#{method} should call console.#{method} with the exact same parameters", ->
              args = ['hello', 1234, {key1: 'value', key2: 0}, true]

              badgee[method] args...

              expect(console[method].called).to.be.true
              expect(console[method].calledWithExactly args...).to.be.true

            it "badge1.#{method} should call console.#{method} with extra parameters", ->
                args = ['hello', 1234, {key1: 'value', key2: 0}, true]

                badge1.instance[method] args...

                expect(console[method].calledOnce).to.be.true
                expect(console[method].calledWithExactly "#{badge1.cName}%c", badge1.cSytle, 'p:a', args...).to.be.true

            it "badge2.#{method} should call console.#{method} with extra parameters", ->
                args = ['hello', 1234, {key1: 'value', key2: 0}, true]

                badge2.instance[method] args...

                expect(console[method].calledOnce).to.be.true
                expect(console[method].calledWithExactly "#{[badge1.cName,badge2.cName].join('')}%c", badge1.cSytle, badge2.cSytle, 'p:a', args...).to.be.true

          describe 'when disabled', ->

            beforeEach ->
              conf = enabled: no
              _spyConsole conf, method

            afterEach ->
              _restoreConsole method

            it "badgee.#{method} should be function", ->
              expect(badgee).to.respondTo method

            it "badge1.#{method} should be function", ->
              expect(badge1.instance).to.respondTo method

            it "badge2.#{method} should be a function", ->
              expect(badge2.instance).to.respondTo method

            it "badgee.#{method} shouldn't call console", ->
              args = ['hello', 1234, {key1: 'value', key2: 0}, true]

              badgee[method] args...

              expect(console[method].called).to.be.false

            it "badge1.#{method} shouldn't call console", ->
              args = ['hello', 1234, {key1: 'value', key2: 0}, true]

              badge1.instance[method] args...

              expect(console[method].called).to.be.false

            it "badge2.#{method} shouldn't call console", ->
              args = ['hello', 1234, {key1: 'value', key2: 0}, true]

              badge2.instance[method] args...

              expect(console[method].called).to.be.false

    for method in unformatableMethods
      do (method) ->

        describe method, ->

          describe 'when enabled', ->

            beforeEach ->
              _spyConsole defaultConf, method

            afterEach ->
              _restoreConsole method

            it "badgee.#{method} should be function", ->
              expect(badgee).to.respondTo method

            it "badge1.#{method} should be function", ->
              expect(badge1.instance).to.respondTo method

            it "badge2.#{method} should be a function", ->
              expect(badge2.instance).to.respondTo method

            it "badgee.#{method} should call console.#{method} with the exact same parameters", ->
              args = ['hello', 1234, {key1: 'value', key2: 0}, true]

              badgee[method] args...

              expect(console[method].called).to.be.true
              expect(console[method].calledWithExactly args...).to.be.true

            it "badge1.#{method} should call console.#{method} without extra parameters", ->
                args = ['hello', 1234, {key1: 'value', key2: 0}, true]

                badge1.instance[method] args...

                expect(console[method].calledOnce).to.be.true
                expect(console[method].calledWithExactly args...).to.be.true

            it "badge2.#{method} should call console.#{method} without extra parameters", ->
                args = ['hello', 1234, {key1: 'value', key2: 0}, true]

                badge2.instance[method] args...

                expect(console[method].calledOnce).to.be.true
                expect(console[method].calledWithExactly args...).to.be.true

          describe 'when disabled', ->

            beforeEach ->
              conf = enabled: no
              _spyConsole conf, method

            afterEach ->
              _restoreConsole method

            it "badgee.#{method} should be function", ->
              expect(badgee).to.respondTo method

            it "badge1.#{method} should be function", ->
              expect(badge1.instance).to.respondTo method

            it "badge2.#{method} should be a function", ->
              expect(badge2.instance).to.respondTo method

            it "badgee.#{method} shouldn't call console when disabled", ->
              args = ['hello', 1234, {key1: 'value', key2: 0}, true]

              badgee[method] args...

              expect(console[method].called).to.be.false

            it "badge1.#{method} shouldn't call console", ->
              args = ['hello', 1234, {key1: 'value', key2: 0}, true]

              badge1.instance[method] args...

              expect(console[method].called).to.be.false

            it "badge2.#{method} shouldn't call console", ->
              args = ['hello', 1234, {key1: 'value', key2: 0}, true]

              badge2.instance[method] args...

              expect(console[method].called).to.be.false

  describe 'badgee.filter', ->

    beforeEach ->
      sinon.spy(console, 'log')

    afterEach ->
      console.log.restore()

    it 'should include badge2 only ', ->
      badgee.filter.include /badge2/

      badge1.instance.log 'test'
      expect(console.log.called).to.be.false

      badge2.instance.log 'test'
      expect(console.log.called).to.be.true

    it 'should reset include filter', ->
      badgee.filter.none()

      badge1.instance.log 'test'
      expect(console.log.called).to.be.true

      badge2.instance.log 'test'
      expect(console.log.called).to.be.true

    it 'should exclude badge2 ', ->
      badgee.filter.exclude /badge2/

      badge2.instance.log 'test'
      expect(console.log.called).to.be.false

      badge1.instance.log 'test'
      expect(console.log.called).to.be.true

    it 'should reset exclude filter', ->
      badgee.filter.none()

      badge1.instance.log 'test'
      expect(console.log.called).to.be.true

      badge2.instance.log 'test'
      expect(console.log.called).to.be.true






