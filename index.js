var Service, Characteristic;
var http = require('http');

module.exports = function(homebridge) {

  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory("homebridge-panasonictv", "TV", PanasonicTV);
}

function PanasonicTV(log, config) {
  this.log = log;
  this.name = config.name;
  this.HOST = config.ip;
  this.PORT = 23;

  this.service = new Service.Switch(this.name);
  this.service.getCharacteristic(Characteristic.On)
    .on("set", this.setOn.bind(this))
    .on("get", this.getOn.bind(this));
}

PanasonicTV.prototype.getServices = function() {
  return [this.service];
}

PanasonicTV.prototype.getOn = function(callback) {
  
  //WIP
  
}



PanasonicTV.prototype.setOn = function(on, callback) {

  if(on){
    
  } else {
    
  }
  callback();
}
