const customCommands = require('../commands/virgin-commands.json'),
    net = require('net'),
    common = require('../lib/common.js'),
    bravia = require('../lib/bravia'),
    broadlink = require('../lib/broadlinkManager');

let client = new net.Socket();

let Virgin = function (ip, callback) {
    let that = this;

    this.ip = ip;
    this.commonHelper = new common(bravia, broadlink);

    client.connect(31339, ip, function () {
        console.log('Virgin - Connected to box');

        if (callback !== undefined) {
            callback(that)
        }
    });
};

Virgin.prototype.command = function (commands) {
    this.commonHelper.runCommands('Virgin', commands, customCommands, this.processIRCommand.bind(this));
};

Virgin.prototype.processIRCommand = function (command) {
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

module.exports = function (ip, callback) {
    return new Virgin(ip, callback)
};