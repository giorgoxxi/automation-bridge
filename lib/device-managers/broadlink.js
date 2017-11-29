const customCommands = require('../../commands/broadlink-commands.json'),
    rawCommands = require('../../commands/raw/broadlink-raw-commands.json'),
    commandProcessor = require('../processors/command-processor.js'),
    broadlinkJS = require('broadlinkjs-rm');

let device = null;

let BroadlinkManager = function (deviceConfig, callback) {
    let that = this;
    let broadlinkConnector = new broadlinkJS();

    device = broadlinkConnector.genDevice(deviceConfig.deviceType, {"address":deviceConfig.ip, "port":deviceConfig.port}, deviceConfig.mac);

    device.on("deviceReady", () => {
        if (callback !== undefined) {
            callback(that)
        }
    });

    device.auth();
};

BroadlinkManager.prototype.executeCommands = function (commands) {
    new commandProcessor().executeCommands('Broadlink', commands, customCommands, this.processCommand.bind(this));
};

BroadlinkManager.prototype.processCommand = function (command) {
    if(!device || command === false) {
        console.log('Missing parameters, processCommand failed', typeof device, typeof command);
        return;
    }

    command = rawCommands[command];

    const hexDataBuffer = new Buffer(command, 'hex');
    device.sendData(hexDataBuffer);
};

module.exports = function (deviceConfig, callback) {
    return new BroadlinkManager(deviceConfig, callback)
};