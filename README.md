# Simple Automation Bridge
A simple automation bridge between the internet and your connected devices.

Currently the following devices are supported:
- Sky set-top box (Sky HD and Sky Q)
- TiVo set-top box (including VM V8 Box)
- Sony Bravia TV
- Broadlink RM-PRO (For infrared and RF signals to non connected devices)

## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/en/) >= 8.9.3 installed 

### Installing

Run the following command from the root directory to install dependency modules:

``` bash
npm install
```

## Configuration
The following files need to be configured to match your environment

### Service Configuration
The service configuration is defined in the [`config.json`](config.json) file:

``` json
{
  "apiKey":"secretkey",
  "port":999
}
```
 
 **apiKey:** A secret key that needs to be sent with every payload for authentication purposes.  
  **port:** The port number to run the service on.
 
 ### Devices configuration
 The devices configuration is defined in the [`devices.json`](devices.json) file:
 
``` json
{
  "<device-name>": {
    "ip": "<ip-address>",
    "port": <port-number>,
    "mac": "<mac-address>",
    "password": "<password>",
    "deviceType": <device-type>
  }  
}
```

**<device-name>:** An identifier for the device  
**ip:** The local IP address of the device  
**port:** The port number of the device that exposes its control API  
**mac:** The MAC address of the device (optional)  
**password:** A password or secret key for the device that is required for access (optional)  
**deviceType:** An identifier for the device (optional)

Here are a few examples:

``` json
{
  "sky": {
    "ip": "192.168.1.1",
    "port": 49160
  },
  "bravia": {
    "ip": "192.168.1.1",
    "mac": "FC:F1:52:85:10:C8",
    "password":"password"
  },
  "tivo": {
    "ip": "192.168.1.1",
    "port": 31339
  },
  "broadlink": {
    "ip": "192.168.1.1",
    "mac": "FC:F1:52:85:10:C8",
    "deviceType":10119,
    "port":80
  }
}
```

## Running the bridge
Use the following command to run the bridge:

``` bash
node run index.js
```

## Executing a Scene

The payload to execute a scene is as follows:

``` json
{
    "scene":"<scene-name>",
    "key":"<api-key>"
}
```

**scene**: The name of the scene as specified in [`scenes.json`](scenes.json)  
**key**: The secret key as specified in [`config.json`](config.json)

### Example using curl

Assuming the bridge is running in `localhost` and port `999`, to execute a scene called `tivoOn` you would run:

``` bash
curl -H "Content-Type: application/json" -X POST -d '{"scene":"tivOn","key":"secretKey"}' http://localhost:999
```

## Executing Actions

To execute a series of actions against a device, the payload needs to be defined as follows:

``` json
{
    "target":"<device-name>",
    "actions":["<command-1>","<command-2>","<command-n>"],
    "key":"<api-key>"
}
```

**target:** The device identifier to run the actions against (as specified in [`devices.json`](devices.json))
**actions:** The list of commands to execute gainst the device  
**key**: The secret key as specified in [`config.json`](config.json)

### Example using curl

Assuming the bridge is running in `localhost` and port `999`, to execute a series of actions to turn on the Sky box and 
go to channel 401 would be as follows:

``` bash
curl -H "Content-Type: application/json" -X POST -d '{"target":"sky","actions":["sky","4","0","1"],"key":"secretKey"}' http://localhost:999
```

## Author

* **Sumeet Sadhwani** - [giorgoXXI](https://github.com/giorgoxxi)

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE.md](LICENSE.md) file for details