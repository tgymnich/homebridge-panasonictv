# homebridge-panasonictv [![npm version](https://badge.fury.io/js/homebridge-panasonictv.svg)](https://badge.fury.io/js/homebridge-panasonictv) ![build status](https://github.com/tg908/homebridge-panasonictv/workflows/Test%20package/badge.svg)

A homebridge plugin for turning on and off your Panasonic Viera TV. 

The plugin also has experimental support for changing the volume and channel. These characteristics are not really supported by HomeKit, but some HomeKit apps do provide you with the abillity to use them.

Apple's own 'Home' app only supports turning your TV on and off. 

## Installation

```bash
# Install homebridge
npm install -g homebridge
# Install homebridge-panasonictv
npm install -g homebridge-panasonictv
```

> Don't forget to update your configuration file! Please refer to the [https://github.com/tg908/homebridge-panasonictv/blob/master/sample-config.json](sample-config.json) in this repository.

## Compatibility

Not all Viera TV's can be turned *on* when their current state is *off* (or bettter: *standby*). This depends on the model. All models should be able to be turned *off*, though.

The following models have been reported to be working with this plugin:

| Model       | Supports ON when OFF |
|-------------|----------------------|
| TX-40CX680B | :white_check_mark:   |
| TX-48AX630E | :white_check_mark:   |
| TX-50CX700B | :white_check_mark:   |
| TX-P50VT50  | :x:                  |
| TX-58DX750  | :white_check_mark:   |
| TX-55EX633E | :x:                  |

## Configuration

To enable support for your Panasonic TV in Homebridge, please add a new accessory to your Homebridge configuration.

```json
"accessories": [
    {
        "accessory": "TV",
        "name": "TV",
        "description": "Livingroom tv",
        "ip": "192.168.178.20",
        "maxVolume": 15
    }
]
```