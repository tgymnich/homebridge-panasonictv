var inherits = require('util').inherits;
var PanasonicViera = require('panasonic-viera-control/panasonicviera.js');
var http = require('http');
var Service, Characteristic, VolumeCharacteristic, ChannelCharacteristic;

module.exports = function(homebridge) {

  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;

  // we can only do this after we receive the homebridge API object
  makeVolumeCharacteristic();
  makeChannelCharacteristic();

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

  this.service
    .addCharacteristic(ChannelCharacteristic)
    .on('get', this.getChannel.bind(this))
    .on('set', this.setChannel.bind(this));

  // Init the panasonic controller
  this.tv = new PanasonicViera(this.HOST);
}

PanasonicTV.prototype.getServices = function() {
  return [this.service];
}

PanasonicTV.prototype.getOn = function(callback) {

  var self = this;
  self.getOnCallback = callback;

  this.getPowerState(this.HOST, function(state) {
    self.getOnCallback(null,state == 1);
  });
}

PanasonicTV.prototype.setOn = function(on, callback) {

  var self = this;
  self.setOnCallback = callback;

  this.getPowerState(this.HOST, function(state) {

    if (state == -1 && on) {
      self.tv.send(PanasonicViera.POWER_TOGGLE);
      self.setOnCallback(null, true);
    }
    else if (state == 0 && on) {
      self.setOnCallback(new Error("The TV is *really* off and cannot be woken up."));
    }
    else if (state == 1 && !on) {
     self.tv.send(PanasonicViera.POWER_TOGGLE);
      self.setOnCallback(null, false);
    }
    else {
     self.setOnCallback(new Error("Cannot fullfill " + (on ? "ON" : "OFF") + " request. Powerstate == " + state));
    }
  })
}

PanasonicTV.prototype.getVolume = function(callback) {

  var self = this;
  self.volumeCallback = callback;

  this.getPowerState(this.HOST, function(state) {

      if (state == 1) {
        self.tv.getVolume(function (data) {
          var translatedVolume = (data / self.maxVolume) * 100;
          self.volumeCallback(null, translatedVolume);
        });
      }
      else {
        self.volumeCallback(null, 0);
      }
  });
}

PanasonicTV.prototype.setVolume = function(volume, callback) {
  // Here we don't care about the TV's powerstate. If it's off, then all calls time out or error..
  var translatedVolume = (volume / 100) * this.maxVolume;
  this.tv.setVolume(translatedVolume);
  callback();
}

PanasonicTV.prototype.getChannel = function(callback) {
  callback(null, 0);
}

PanasonicTV.prototype.setChannel = function(channel, callback) {
  this.tv.send("D" + channel);
  callback();
}

// Returns:
// -1 when the TV is in standby-mode (a 400-Bad Request is returned by the TV)
//  0 when the TV is off, or it's a TV that does not support the standby wake-up request(the request errors)
//  1 when the TV is on (a normal 200 response is returned)
PanasonicTV.prototype.getPowerState = function(ipAddress, stateCallback) {

  var path = "/dmr/control_0";
  var body = '<?xml version="1.0" encoding="utf-8"?>\n' +
             '<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">\n' +
             ' <s:Body>\n' +
             '  <u:getVolume xmlns:u="urn:schemas-upnp-org:service:RenderingControl:1">\n' +
             '   <InstanceID>0</InstanceID><Channel>Master</Channel>\n' +
             '  </u:getVolume>\n' +
             ' </s:Body>\n' +
             '</s:Envelope>\n';

  var post_options = {
    host: ipAddress,
    port: '55000',
    path: path,
    method: 'POST',
    headers: {
      'Content-Length': body.length,
      'Content-Type': 'text/xml; charset="utf-8"',
      'User-Agent': 'net.thlabs.nodecontrol',
      'SOAPACTION': '"urn:schemas-upnp-org:service:RenderingControl:1#getVolume"'
    }
  }

  // The request intermittently TIMES OUT, ERRORS, OR BOTH(!) when the TV is not
  // available. Therefore we're maintaining state whether the callback is called
  // since you're only allowed to call the Homekit-callback once.
  var calledBack = false;

  var req = http.request(post_options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function(data) {
      // do nothing here, but without attaching a 'data' event, the 'end' event is not called
    });
    res.on('end', function() {
      if(res.statusCode == 200) {
        if (!calledBack) {
          stateCallback(1);
        }
      }
      else {
        if (!calledBack) {
          stateCallback(-1);
        }
      }
    });
  });

 req.on('error', function(e) {
    console.log('errored');
    console.log(e);
    if (!calledBack) {
      stateCallback(0);
      calledBack = true;
    }
    else {
      console.log ("already called callback");
    }
  });
  req.on('timeout', function() {
    console.log('timed out');
    if (!calledBack) {
      stateCallback(0);
      calledBack = true;
    }
    else {
      console.log ("already called callback");
    }
  });

  req.setTimeout(2000);

  req.write(body);
  req.end();
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

function makeChannelCharacteristic() {

  ChannelCharacteristic = function () {
    Characteristic.call(this, 'Channel', '212131F4-2E14-4FF4-AE13-C97C3232499D');
    this.setProps({
      format: Characteristic.Formats.INT,
      unit: Characteristic.Units.NONE,
      maxValue: 100,
      minValue: 0,
      minStep: 1,
      perms: [Characteristic.Perms.READ, Characteristic.Perms.WRITE, Characteristic.Perms.NOTIFY]
    });
    this.value = this.getDefaultValue();
  };

  inherits(ChannelCharacteristic, Characteristic);
}
