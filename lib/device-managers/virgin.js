const customCommands = require('../../commands/virgin-commands.json'),
    net = require('net'),
    commandProcessor = require('../processors/command-processor');

let client = new net.Socket();

let Virgin = function (deviceConfig, callback) {
    let that = this;

    this.ip = deviceConfig.ip;

    client.connect(31339, deviceConfig.ip, function () {
        console.log('Virgin - Connected to box');

        if (callback !== undefined) {
            callback(that)
        }
    });
};

Virgin.prototype.executeCommands = function (commands) {
    new commandProcessor().executeCommands('Virgin', commands, customCommands, this.processCommand.bind(this));
};

Virgin.prototype.processCommand = function (command) {
    console.log('Virgin - Sending command: ' + command);

    if (isNaN(command)) {
        this.sendIRCommand(command);
    }
    else {
        this.sendChannelCommand(command);
    }
};

Virgin.prototype.sendChannelCommand = function (command) {
    client.write('SETCH ' + command + '\r\n');
};

Virgin.prototype.sendIRCommand = function (command) {
    client.write('IRCODE ' + command + '\r\n');
};

module.exports = function (deviceConfig, callback) {
    return new Virgin(deviceConfig, callback)
};