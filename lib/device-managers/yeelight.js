const customCommands = require('../../commands/yeelight-commands.json'),
    rawCommands = require('../../commands/raw/yeelight-raw-commands.json'),
    commandProcessor = require('../processors/command-processor.js'),
    nodeYeelight = require('node-yeelight');

let YeelightManager = function (deviceConfig, callback) {
    let that = this;

    this.ip = deviceConfig.ip;
    this.port = deviceConfig.port;
    this.yeelightConnector = new nodeYeelight();
    this.commandProcessor = new commandProcessor(customCommands);

    if (callback !== undefined) {
        callback(that)
    }
};

YeelightManager.prototype.executeCommands = function (commands) {
    this.commandProcessor.executeCommands('Yeelight', commands, this.processCommand.bind(this));
};

YeelightManager.prototype.processCommand = function (command) {
    let that = this;
    let rawCommand = rawCommands[command];

    let device = {"host": this.ip, "port": this.port, "connected": false, "socket": null};

    this.yeelightConnector.on('deviceconnected', function (device) {
        that.yeelightConnector[rawCommand.functionToCall](device, ...rawCommand.parameters);

        setTimeout(function () {
            device.socket.destroy();
            device.socket.unref();
        }, 500);
    });

    this.yeelightConnector.connect(device);
};

module.exports = function (deviceConfig, callback) {
    return new YeelightManager(deviceConfig, callback)
};