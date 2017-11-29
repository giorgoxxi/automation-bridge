const skyRemote = require('sky-remote'),
    customCommands = require('../../commands/sky-commands.json'),
    commandProcessor = require('../processors/command-processor');

let Sky = function (deviceConfig, callback){
    let that = this;

    this.ip = deviceConfig.ip;
    this.skyRemote = new skyRemote(this.ip);

    if (callback !== undefined) {
        callback(that)
    }
};

Sky.prototype.executeCommands = function (commands) {
    new commandProcessor().executeCommands('Sky', commands, customCommands, this.processCommand.bind(this));
};

Sky.prototype.processCommand = function(command){
    this.skyRemote.press(command);
};

module.exports = function (deviceConfig, callback) {
    return new Sky(deviceConfig, callback)
};