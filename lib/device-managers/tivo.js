const customCommands = require('../../commands/tivo-commands.json'),
    net = require('net'),
    commandProcessor = require('../processors/command-processor');

let TiVo = function (deviceConfig, callback) {
    let that = this;

    this.ip = deviceConfig.ip;
    this.port = deviceConfig.port;
    this.commandProcessor = new commandProcessor(customCommands);

    if (callback !== undefined){
        callback(that);
    }
};

TiVo.prototype.executeCommands = function (commands) {
    this.commandProcessor.executeCommands('TiVo', commands, this.processCommand.bind(this));
};

TiVo.prototype.processCommand = function (command) {
    console.log('TiVo - Sending command: ' + command);

    if (isNaN(command)) {
        this.sendIRCommand(command);
    }
    else {
        this.sendChannelCommand(command);
    }
};

TiVo.prototype.sendChannelCommand = function (command) {
    this.sendCommand('SETCH', command);
};

TiVo.prototype.sendIRCommand = function (command) {
    this.sendCommand('IRCODE', command);
};

TiVo.prototype.sendCommand = function (commandText, command){
    let client = new net.Socket();

    client.connect(this.port, this.ip, function () {
        console.log('TiVo - Connected to box');
        client.write(commandText + ' ' + command + '\r\n');
        client.destroy();
    });
};

module.exports = function (deviceConfig, callback) {
    return new TiVo(deviceConfig, callback)
};