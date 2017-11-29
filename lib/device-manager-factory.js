const braviaManager = require('./device-managers/bravia'),
    broadlinkManager = require('./device-managers/broadlink'),
    skyManager = require('./device-managers/sky'),
    virginManager = require('./device-managers/virgin');

let DeviceManagerFactory = function(deviceName) {
    this.deviceManager = null;

    switch (deviceName){
        case 'bravia':
            this.deviceManager = braviaManager;
            return;
        case 'broadlink':
            this.deviceManager = broadlinkManager;
            return;
        case 'sky':
            this.deviceManager = skyManager;
            return;
        case 'virgin':
            this.deviceManager = virginManager;
            return;
    }
};

module.exports = (deviceName) => {
    return new DeviceManagerFactory(deviceName);
};