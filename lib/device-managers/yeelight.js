const customCommands = require('../../commands/yeelight-commands.json'),
    rawCommands = require('../../commands/raw/yeelight-raw-commands.json'),
    commandProcessor = require('../processors/command-processor.js'),
    nodeYeelight = require('node-yeelight');

let YeelightManager = function (deviceConfig, callback) {
    let that = this;

    this.yeelightConnector = new nodeYeelight();
    this.commandProcessor = new commandProcessor(customCommands);

    this.device = {"host": deviceConfig.ip, "port": deviceConfig.port, "connected": false, "socket": null};

    this.yeelightConnector.on('deviceconnected', function () {
        if (callback !== undefined) {
            callback(that)
        }
    });

    this.yeelightConnector.connect(this.device);
};

YeelightManager.prototype.executeCommands = function (commands) {
    this.commandProcessor.executeCommands('Yeelight', commands, this.processCommand.bind(this));
};

YeelightManager.prototype.processCommand = function (command) {
    let rawCommand = rawCommands[command];

    this.yeelightConnector[rawCommand.functionToCall](this.device, ...rawCommand.parameters);
};

module.exports = function (deviceConfig, callback) {
    return new YeelightManager(deviceConfig, callback)
};