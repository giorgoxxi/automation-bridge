const skyRemote = require('sky-remote'),
    customCommands = require('../../commands/sky-commands.json'),
    commandProcessor = require('../processors/command-processor');

const CHANNEL_COMMAND_LENGTH = 3;

let Sky = function (deviceConfig, callback){
    let that = this;

    this.ip = deviceConfig.ip;
    this.skyRemote = new skyRemote(this.ip);
    this.commandProcessor = new commandProcessor(customCommands);

    if (callback !== undefined) {
        callback(that)
    }
};

Sky.prototype.executeCommands = function (commands) {
    this.commandProcessor.executeCommands('Sky', commands, this.processCommand.bind(this));
};

Sky.prototype.processCommand = function(command){
    if (!isNaN(command) && command.length === CHANNEL_COMMAND_LENGTH) {
        let channelString = command;
        command = [];

        for (let i = 0; i < channelString.length; i++) {
            let digit = channelString[i];
            command.push(digit);
        }
    }

    this.skyRemote.press(command);
};

module.exports = function (deviceConfig, callback) {
    return new Sky(deviceConfig, callback)
};