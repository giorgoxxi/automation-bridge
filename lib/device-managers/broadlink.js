const customCommands = require('../../user-config/commands/broadlink-commands.json'),
    rawCommands = require('../../user-config/commands/raw/broadlink-raw-commands.json'),
    commandProcessor = require('../processors/command-processor.js'),
    broadlinkJS = require('broadlinkjs-rm');

let device = null;

let BroadlinkManager = function (deviceConfig, callback) {
    let that = this;
    let broadlinkConnector = new broadlinkJS();

    this.commandProcessor = new commandProcessor(customCommands);

    device = broadlinkConnector.genDevice(deviceConfig.deviceType, {"address":deviceConfig.ip, "port":deviceConfig.port}, deviceConfig.mac);

    device.on("deviceReady", () => {
        if (callback !== undefined) {
            callback(that)
        }
    });

    device.auth();
};

BroadlinkManager.prototype.executeCommands = function (commands) {
    this.commandProcessor.executeCommands('Broadlink', commands, this.processCommand.bind(this));
};

BroadlinkManager.prototype.processCommand = function (command) {
    if(!device) {
        console.log('Broadlink - Device not ready');
        return;
    }

    command = rawCommands[command];

    const hexDataBuffer = new Buffer(command, 'hex');
    device.sendData(hexDataBuffer);
};

module.exports = function (deviceConfig, callback) {
    return new BroadlinkManager(deviceConfig, callback)
};