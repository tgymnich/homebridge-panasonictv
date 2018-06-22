# homebridge-panasonictv https://badge.fury.io/js/homebridge-panasonictv.svg

A homebridge plugin for turning on and off your Panasonic Viera TV. 

The plugin also has experimental support for changing the volume and channel. These characteristics are not really supported by HomeKit, but some HomeKit apps do provide you with the abillity to use them.

Apple's own 'Home' App, only support on/off. 

# Installation

1. Install homebridge using: `npm install -g homebridge`
2. Install this plugin using: `npm install -g homebridge-panasonictv`
3. Update your configuration file. See sample-config.json in this repository for a sample. 

# Compatible TVs:

Not all Viara TV's can be turned *on* when their current state is *off* (or bettter: *standby*). This depends on the model. All models should be able to be turned *off*, though.

The following models have been reported to be working with this plugin:

| Model | Supports ON when OFF |
| --- | --- |
| TX-40CX680B | :white_check_mark: |
| TX-48AX630E | :white_check_mark: |
| TX-50CX700B | :white_check_mark: |
| TX-P50VT50 | :x: |
| TX-58DX750 | :white_check_mark: | 

# Configuration

Configuration sample:

 ```
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
