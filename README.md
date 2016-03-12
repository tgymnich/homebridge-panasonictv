# homebridge-panasonictv

A homebridge Plugin for turning on and off your Panasonic TV


# Installation

1. Install homebridge using: npm install -g homebridge
2. Install this plugin using: npm install -g homebridge-panasonictv
3. Update your configuration file. See sample-config.json in this repository for a sample. 

# Compatible TVs:

In my experience not every TV can be turned on, when it is off

The following models are confirmed to work:

1. TX-50CX700B

If your TV does not support turning it on over this plugin you might want to consider using this pluign:
https://github.com/fguchelaar/homebridge-panasonictv


# Configuration

Configuration sample:

 ```
"accessories": [
        {
            "accessory": "TV",
            "name": "TV",
            "description": "Livingroom tv",
            "ip": "192.168.178.20"
        }

    ]
```
#To Do

1. Get the on/off status of the TV

