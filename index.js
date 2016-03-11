var inherits = require('util').inherits;
var PanasonicViera = require('./node_modules/panasonic-viera-control/panasonicviera.js');
var Service, Characteristic, VolumeCharacteristic;

module.exports = function(homebridge) {

  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  
  // we can only do this after we receive the homebridge API object
  makeVolumeCharacteristic();

  homebridge.registerAccessory("homebridge-panasonictv", "TV", PanasonicTV);
}

function PanasonicTV(log, config) {
  this.log = log;
  this.name = config.name;
  this.HOST = config.ip;
  this.maxVolume = config.maxVolume || 12;

  this.service = new Service.Switch(this.name);

  this.service
    .getCharacteristic(Characteristic.On)
    .on("set", this.setOn.bind(this))
    .on("get", this.getOn.bind(this));

  this.service
    .addCharacteristic(VolumeCharacteristic)
    .on('get', this.getVolume.bind(this))
    .on('set', this.setVolume.bind(this));

  // Init the panasonic controller
  this.tv = new PanasonicViera(this.HOST);
}

PanasonicTV.prototype.getServices = function() {
  return [this.service];
}

PanasonicTV.prototype.getOn = function(callback) {
  // Temporary default to TRUE
  callback(null, true);
}

PanasonicTV.prototype.setOn = function(on, callback) {

  if(on) {
    callback(new Error("This plugin cannot power the TV on, sadly."));
  }
  else {
    this.tv.send(PanasonicViera.POWER_TOGGLE);
    callback();
  }
}

PanasonicTV.prototype.getVolume = function(callback) {
  this.tv.getVolume(function (data) {
    var v = (data / this.maxVolume) * 100;
    callback(null, v);
  });
}

PanasonicTV.prototype.setVolume = function(volume, callback) {
  var v = (volume / 100) * this.maxVolume;
  this.tv.setVolume(v);
  callback();
}

function makeVolumeCharacteristic() {

  VolumeCharacteristic = function() {
    Characteristic.call(this, 'Volume', '91288267-5678-49B2-8D22-F57BE995AA93');
    this.setProps({
      format: Characteristic.Formats.INT,
      unit: Characteristic.Units.PERCENTAGE,
      maxValue: 100,
      minValue: 0,
      minStep: 1,
      perms: [Characteristic.Perms.READ, Characteristic.Perms.WRITE, Characteristic.Perms.NOTIFY]
    });
    this.value = this.getDefaultValue();
  };
  
  inherits(VolumeCharacteristic, Characteristic);
}