const customCommands = require('../../user-config/commands/tplink-plug-commands.json'),
    rawCommands = require('../../user-config/commands/raw/tplink-plug-raw-commands.json'),
    commandProcessor = require('../processors/command-processor.js'),
    tplinkSmartHome = require('tplink-smarthome-api');

let TPlinkPlugManager = function (deviceConfig, callback) {
    let that = this;

    this.ip = deviceConfig.ip;
    this.port = deviceConfig.port;
    this.tplinkConnector = new tplinkSmartHome.Client();
    this.commandProcessor = new commandProcessor(customCommands);

    if (callback !== undefined) {
        callback(that)
    }
};

TPlinkPlugManager.prototype.executeCommands = function (commands) {
    this.commandProcessor.executeCommands('TPLink-Plug', commands, this.processCommand.bind(this));
};

TPlinkPlugManager.prototype.processCommand = function (command) {
    let rawCommand = rawCommands[command];

    this.tplinkConnector.getDevice({host: this.ip}).then((device) => {
        if (device[rawCommand.functionToCall]){
            device[rawCommand.functionToCall](...rawCommand.parameters);
        } else {
            device.timer[rawCommand.functionToCall](...rawCommand.parameters);
        }
    }).catch((reason) => {
        console.log('Error - ' + reason)
    });
};

module.exports = function (deviceConfig, callback) {
    return new TPlinkPlugManager(deviceConfig, callback)
};