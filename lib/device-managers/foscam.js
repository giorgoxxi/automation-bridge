const customCommands = require('../../user-config/commands/foscam-commands.json'),
    rawCommands = require('../../user-config/commands/raw/foscam-raw-commands.json'),
    commandProcessor = require('../processors/command-processor.js'),
    util = require('util'),
    request = require('request');

let FoscamManager = function (deviceConfig, callback) {
    let that = this;

    this.ip = deviceConfig.ip;
    this.port = deviceConfig.port;
    this.username = deviceConfig.username;
    this.password = deviceConfig.password;
    this.commandProcessor = new commandProcessor(customCommands);

    if (callback !== undefined) {
        callback(that)
    }
};

FoscamManager.prototype.executeCommands = function (commands) {
    this.commandProcessor.executeCommands('Foscam', commands, this.processCommand.bind(this));
};

FoscamManager.prototype.processCommand = function (command) {
    const urlFormat = "http://%s:%s/%s.cgi?user=%s&pwd=%s%s";

    let commandDefinition = rawCommands[command];
    let parametersAsString = this.getParameters(commandDefinition);
    let url = util.format(urlFormat, this.ip, this.port, commandDefinition.functionToCall, this.username,
        this.password, parametersAsString);

    request(url, function (error, response, body) {
        if (response && response.statusCode === 200) {
            console.log('Foscam - Command processed successfully');
        }
        else {
            console.log('Foscam - Command processed unsuccessfully');
        }
    });
};

FoscamManager.prototype.getParameters = function (commandDefinition) {
    let parametersAsString = "";

    for (let parameter in commandDefinition.parameters) {
        let parameterValue = commandDefinition.parameters[parameter];
        parametersAsString += '&' + parameter + '=' + parameterValue;
    }

    return parametersAsString;
};

module.exports = function (deviceConfig, callback) {
    return new FoscamManager(deviceConfig, callback);
};