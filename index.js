'use strict';
var util = require('util');
var request = require('request');
var EventEmitter = require('events').EventEmitter;
var debug = require('debug')('gif-blu')

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

var DEFAULT_OPTIONS = {
  api_key : "dc6zaTOxFJmzC"
}

function Plugin(){
  this.options = DEFAULT_OPTIONS;
  this.messageSchema = MESSAGE_SCHEMA;
  this.optionsSchema = OPTIONS_SCHEMA;
  return this;
}
util.inherits(Plugin, EventEmitter);

Plugin.prototype.onMessage = function(message){
  var payload = message.payload;
  this.getGifs(payload);
};

Plugin.prototype.onConfig = function(device){
  this.setOptions(device.options || {} );
};

Plugin.prototype.setOptions = function(options){
  this.options = options;
};

Plugin.prototype.getGifs = function(payload){
  var self = this;
  var baseUrl = 'http://api.giphy.com/v1/gifs/';
  var options = {qs : {api_key : self.options.api_key }};
  if (payload.search === 'random'){
    baseUrl += 'random';
  } else if (payload.search === 'trending'){
    baseUrl += 'trending';
  } else {
    baseUrl += 'search';
    options.qs.q = payload.search;
  }
  options.uri = baseUrl;

  request(options, function(error, response, body){
    self.emit('data', JSON.parse(body));
  });
};

module.exports = {
  messageSchema: MESSAGE_SCHEMA,
  optionsSchema: OPTIONS_SCHEMA,
  Plugin: Plugin
};
