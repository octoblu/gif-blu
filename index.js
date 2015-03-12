'use strict';
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var debug = require('debug')('octocat-facts')

var MESSAGE_SCHEMA = {
  type: 'object',
  properties: {
    gif_count: {
      type: 'number',
      default: 1
    },
    search: {
      type: 'string',
      required: true,
      default: 'random',
      displayName: 'search(random, trending, query)'
    }
  }
};

var OPTIONS_SCHEMA = {
  type: 'object',
  properties: {
    api_key: {
      type: 'string',
      required: true,
      default: "dc6zaTOxFJmzC"
    }
  }
};

function Plugin(){
  this.options = {};
  this.messageSchema = MESSAGE_SCHEMA;
  this.optionsSchema = OPTIONS_SCHEMA;
  return this;
}
util.inherits(Plugin, EventEmitter);

Plugin.prototype.onMessage = function(message){
  var payload = message.payload;
  this.emit('message', {devices: ['*'], topic: 'echo', payload: payload});
};

Plugin.prototype.onConfig = function(device){
  this.setOptions(device.options||{});
};

Plugin.prototype.setOptions = function(options){
  this.options = options;
};

module.exports = {
  messageSchema: MESSAGE_SCHEMA,
  optionsSchema: OPTIONS_SCHEMA,
  Plugin: Plugin
};
